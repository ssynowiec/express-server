import { Router } from 'express';
import { generateState, OAuth2RequestError } from 'arctic';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { facebook } from '../auth/facebook';
import { db } from '../db.config';
import { adminTable } from '../modules/admins/admins.schema';
import { eq } from 'drizzle-orm';
import { lucia } from '../auth/auth';
import { generateId } from 'lucia';

export const facebookRoutes = Router();

facebookRoutes.get('/', async (req, res) => {
  const state = generateState();
  const url = await facebook.createAuthorizationURL(state);

  res
    .appendHeader(
      'Set-Cookie',
      serializeCookie('facebook_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      }),
    )
    .redirect(url.toString());
});

facebookRoutes.get('/callback', async (req, res) => {
  const code = req.query.code.toString() ?? null;

  const storedState =
    parseCookies(req.headers.cookie ?? '').get('facebook_oauth_state') ?? null;

  if (!code) {
    res.status(400).end();
    return;
  }

  try {
    const tokens = await facebook.validateAuthorizationCode(code);

    const facebookUserResponse = await fetch(
      `https://graph.facebook.com/me?access_token=${tokens.accessToken}&fields=id,name,email,picture`,
    );

    const facebookUser = await facebookUserResponse.json();

    const existingUsers = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.facebook_id, facebookUser.id));

    const existingUser = existingUsers[0];

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});

      return res
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect(`${process.env.FRONTEND_URL}/admin`);
    }

    const userId = generateId(15);

    await db.insert(adminTable).values({
      id: userId,
      username: facebookUser.login,
      email: facebookUser.email,
      facebook_id: facebookUser.id,
      avatar_url: facebookUser.picture.data.url,
    });

    const session = await lucia.createSession(userId, {});

    return res
      .appendHeader(
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
      .redirect(`${process.env.FRONTEND_URL}/admin`);
  } catch (error) {
    if (
      error instanceof OAuth2RequestError &&
      error.message === 'bad_verification_code'
    ) {
      res.status(400).end();
      return;
    }
    res.status(500).end();
    return;
  }
});

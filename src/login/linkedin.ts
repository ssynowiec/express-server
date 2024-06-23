import { Router } from 'express';
import { generateState, OAuth2RequestError } from 'arctic';
import { serializeCookie } from 'oslo/cookie';
import { db } from '../db.config';
import { adminTable } from '../modules/admins/admins.schema';
import { eq } from 'drizzle-orm';
import { lucia } from '../auth/auth';
import { generateId } from 'lucia';
import { linkedin } from '../auth/linkedin';

export const linkedinRoutes = Router();

linkedinRoutes.get('/', async (req, res) => {
  const state = generateState();

  const url = await linkedin.createAuthorizationURL(state, {
    scopes: ['email', 'profile'],
  });

  res
    .appendHeader(
      'Set-Cookie',
      serializeCookie('linkedin_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      }),
    )
    .redirect(url.toString());
});

linkedinRoutes.get('/callback', async (req, res) => {
  const code = req.query?.code?.toString() ?? null;

  if (!code) {
    res.status(400).end();
    return;
  }

  try {
    const tokens = await linkedin.validateAuthorizationCode(code);

    const linkedinUserResponse = await fetch(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const linkedinUser = await linkedinUserResponse.json();

    const existingUsers = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.linkedin_id, linkedinUser.sub));

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
      username: linkedinUser.login,
      email: linkedinUser.email,
      linkedin_id: linkedinUser.id,
      avatar_url: linkedinUser.picture.data.url,
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

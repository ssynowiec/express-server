import { Router } from 'express';
import { generateState, OAuth2RequestError } from 'arctic';
import { github } from '../auth/github';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { db } from '../db.config';
import { eq } from 'drizzle-orm';
import { adminTable } from '../modules/admins/admins.schema';
import { lucia } from '../auth/auth';
import { generateId } from 'lucia';
import { linkAccount } from '../auth/accountLinking';

export const githubRouter = Router();

githubRouter.get('', async (_, res) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);
  console.log('auth url', url.toString());
  res
    .appendHeader(
      'Set-Cookie',
      serializeCookie('github_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      }),
    )
    .redirect(url.toString());
});

githubRouter.get('/callback', async (req, res) => {
  const code = req.query.code.toString() ?? null;
  const state = req.query.state.toString() ?? null;

  const storedState =
    parseCookies(req.headers.cookie ?? '').get('github_oauth_state') ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    res.status(400).end();
    return;
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser = await githubUserResponse.json();

    const existingUsers = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.github_id, githubUser.id));

    const existingUser = existingUsers[0];

    console.log('existing user', existingUser);

    if (existingUser) {
      console.log('user exists');
      const session = await lucia.createSession(existingUser.id, {});

      return res
        .appendHeader(
          'Set-Cookie',
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect(`${process.env.FRONTEND_URL}/admin`);
    }

    const linkedAccount = await linkAccount(
      githubUser.email,
      'github',
      githubUser.id,
    );

    if (linkedAccount) {
      const session = await lucia.createSession(linkedAccount.id, {});

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
      username: githubUser.login,
      email: githubUser.email,
      github_id: githubUser.id,
      avatar_url: githubUser.avatar_url,
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

import { Router } from 'express';
import {
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from 'arctic';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { db } from '../db.config';
import { adminTable } from '../modules/admins/admins.schema';
import { eq } from 'drizzle-orm';
import { lucia } from '../auth/auth';
import { generateId } from 'lucia';
import { google } from '../auth/google';

export const googleRoutes = Router();

googleRoutes.get('/', async (req, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['email', 'profile'],
  });

  res
    .appendHeader(
      'Set-Cookie',
      serializeCookie('google_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      }),
    )
    .appendHeader(
      'Set-Cookie',
      serializeCookie('google_oauth_code', codeVerifier, {
        httpOnly: true,
      }),
    )
    .redirect(url.toString());
});

googleRoutes.get('/callback', async (req, res) => {
  const code = req.query?.code?.toString() ?? null;
  const state = req.query?.state?.toString() ?? null;

  if (!code || !state) {
    res.status(400).end();
    return;
  }

  const codeVerifier =
    parseCookies(req.headers.cookie ?? '').get('google_oauth_code') ?? null;
  const storedState =
    parseCookies(req.headers.cookie ?? '').get('google_oauth_state') ?? null;

  if (!codeVerifier || !storedState || state !== storedState) {
    res.status(400).end();
    return;
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const googleUserResponse = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const googleUser = await googleUserResponse.json();

    const existingUsers = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.google_id, googleUser.id));

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
      username: googleUser.login,
      email: googleUser.email,
      google_id: googleUser.id,
      avatar_url: googleUser.picture.data.url,
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

import express from 'express';
import { lucia } from './auth';
import { parseCookies } from 'oslo/cookie';

export const logoutRouter = express.Router();

logoutRouter.post('', async (req, res) => {
  if (!req.headers.cookie) {
    return res.status(401).end();
  }

  const cookies = parseCookies(req.headers.cookie);
  const auth_session = cookies.get('auth_session');

  if (!auth_session) {
    return res.status(401).end();
  }

  await lucia.invalidateSession(auth_session);
  return res
    .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
    .status(204)
    .redirect(`${process.env.FRONTEND_URL}/login`);
});

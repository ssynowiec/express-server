import express from 'express';
import { lucia } from './auth';
import { parseCookies } from 'oslo/cookie';

export const logoutRouter = express.Router();

logoutRouter.post('', async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const auth_session = cookies.get('auth_session');

  if (!auth_session) {
    return res.status(401).end();
  }

  await lucia.invalidateSession(auth_session);
  return res
    .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
    .redirect('http://localhost:3000/login');
});

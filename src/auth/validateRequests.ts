import { Router } from 'express';
import { parseCookies } from 'oslo/cookie';
import { lucia } from './auth';

export const validateSessionRoute = Router();

validateSessionRoute.get('/', async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const auth_session = cookies.get('auth_session');

  if (!auth_session || auth_session === '') {
    return res.status(404).json({ error: 'No session' });
  }

  const result = await lucia.validateSession(auth_session);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      return res.appendHeader('Set-Cookie', sessionCookie.serialize());
    }
    if (!result.session) {
      return res
        .setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
        .redirect('http://localhost:3000/login');
    }
  } catch {}

  res.status(200).json(result);
});

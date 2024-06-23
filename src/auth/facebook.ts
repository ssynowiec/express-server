import { Facebook } from 'arctic';

export const facebook = new Facebook(
  process.env.FACEBOOK_CLIENT_ID!,
  process.env.FACEBOOK_CLIENT_SECRET!,
  'http://localhost:4001/login/facebook/callback',
);

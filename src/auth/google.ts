import { Google } from 'arctic';

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  'http://localhost:4001/login/google/callback',
);

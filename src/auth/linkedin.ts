import { LinkedIn } from 'arctic';

export const linkedin = new LinkedIn(
  process.env.LINKEDIN_CLIENT_ID!,
  process.env.LINKEDIN_CLIENT_SECRET!,
  'http://localhost:4001/login/linkedin/callback',
);

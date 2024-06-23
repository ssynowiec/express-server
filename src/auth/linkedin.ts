import { LinkedIn } from 'arctic';
import { env } from '@/env';

export const linkedin = new LinkedIn(
	env.LINKEDIN_CLIENT_ID!,
	env.LINKEDIN_CLIENT_SECRET!,
	'http://localhost:3000/login/linkedin/callback',
);

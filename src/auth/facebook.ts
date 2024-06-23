import { Facebook } from 'arctic';
import { env } from '@/env';

export const facebook = new Facebook(
	env.FACEBOOK_CLIENT_ID!,
	env.FACEBOOK_CLIENT_SECRET!,
	'http://localhost:3000/login/facebook/callback',
);

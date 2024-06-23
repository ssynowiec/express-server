'use server';

import { validateRequest } from '@/lib/auth/validateRequests';
import { lucia } from '@/lib/auth/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface ActionResult {
	error: string | null;
}

export const signOut = async (): Promise<ActionResult> => {
	console.log('signing out');
	const { session } = await validateRequest();
	console.log('session', session);
	if (!session) {
		return { error: 'Unauthorized' };
	}
	console.log('invalidating session');
	await lucia.invalidateSession(session.id);
	console.log('creating blank session cookie');
	const sessionCookie = lucia.createBlankSessionCookie();
	console.log('setting session cookie');
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return redirect('/login');
};

import { getOrCreateUser } from '$lib/server/userStore';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const user = await getOrCreateUser(params.login);
	if (user === null) throw error(400, 'Invalid login!');

	return {
		user
	};
}

export const prerender = false;

export const ssr = false;

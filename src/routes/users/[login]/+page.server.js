import { getOrCreateUser } from '$lib/server/userStore';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const user = getOrCreateUser(params.login)
	if (user === null)
		throw error(400, 'Invalid login!')

	return {
		user
	}
}

export const prerender = false;

export const ssr = false
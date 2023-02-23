import { handleCASLogin } from '$lib/server/cas';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url, fetch, locals }) {
	return (await handleCASLogin(url, fetch, locals))
}
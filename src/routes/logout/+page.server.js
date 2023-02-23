
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	await locals.session.destroy()
	return { session: locals.session.data }
}
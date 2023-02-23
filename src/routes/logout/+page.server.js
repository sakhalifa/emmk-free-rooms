
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	let result = await locals.session.destroy()
	return { success: result, session: locals.session.data }
}
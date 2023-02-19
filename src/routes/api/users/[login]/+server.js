import { checkError, isValidDate } from '$lib/server/utils';
import { json } from '@sveltejs/kit';
import { getOrCreateUser, getPlanningForUser } from '$lib/server/userStore';

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const urlParams = [
	// @ts-ignore
	{ name: 'start', required: false, type: 'date', _parser: async (s) => new Date(s), _checkFunction: async (d) => isValidDate(d), _parseFailMessage: "Not a valid ISO date! It's in format YYYY-MM-DD!" },
	// @ts-ignore
	{ name: 'end', required: false, type: 'date', _parser: async (s) => new Date(s), _checkFunction: async (d) => isValidDate(d), _parseFailMessage: "Not a valid ISO date! It's in format YYYY-MM-DD!" },
	{ name: 'user', required: true, type: 'string', _parser: getOrCreateUser, _checkFunction: async (u) => u !== null, _parseFailMessage: "This login does not exist!" }
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	url.searchParams.set("user", params.login)
	let [errorOccured, value] = await checkError(url.searchParams, urlParams)
	if (errorOccured)
		return json(value, { status: 400 });

	/**
	 * @type {{start: Date, end: Date, user: import('$lib/server/types.d').User}}
	 */
	let { start, end, user } = value
	if(start === undefined)
		start = new Date()
	if(end === undefined)
		end = new Date(start)
	return json(await getPlanningForUser(user, start, end))

}
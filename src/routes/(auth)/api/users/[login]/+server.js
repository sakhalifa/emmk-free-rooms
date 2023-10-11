import { checkError, isValidDate } from '$lib/server/utils';
import { json } from '@sveltejs/kit';
import { getOrCreateUser, getPlanningForUser } from '$lib/server/userStore';
import { handleCASLogin } from '$lib/server/cas';

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const urlParams = [
	// @ts-ignore
	{
		name: 'start',
		required: false,
		type: 'date',
		_parser: async (s) => new Date(s),
		_checkFunction: (d) => (d instanceof Date ? isValidDate(d) : false),
		_parseFailMessage: "Not a valid ISO date! It's in format YYYY-MM-DD!"
	},
	// @ts-ignore
	{
		name: 'end',
		required: false,
		type: 'date',
		_parser: (s) => new Date(s),
		_checkFunction: (d) => (d instanceof Date ? isValidDate(d) : false),
		_parseFailMessage: "Not a valid ISO date! It's in format YYYY-MM-DD!"
	},
	{
		name: 'user',
		required: true,
		type: 'string',
		_parser: getOrCreateUser,
		_checkFunction: (u) => u !== null,
		_parseFailMessage: 'This login does not exist!'
	}
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params, fetch, locals }) {
	await handleCASLogin(url, fetch, locals);
	url.searchParams.set('user', params.login);
	let [errorOccured, value] = await checkError(url.searchParams, urlParams);
	if (errorOccured) return json(value, { status: 400 });

	/**
	 * @type {{start: Date, end: Date, user: import('$lib/types.d').User}}
	 */
	let { start, end, user } = value;
	if (start === undefined) start = new Date();
	if (end === undefined) end = new Date(start);
	try {
		const planning = await getPlanningForUser(user, start, end);
		return json(planning);
	} catch (e) {
		console.error(e);
		return json({status: "TOO SPACED DATES", error:`There is too big of a gap between start and end`})
	}
}

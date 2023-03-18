import { getOrCreateUser } from '$lib/server/userStore';
import { checkError } from '$lib/server/utils';
import { error } from '@sveltejs/kit';

/**
 * 
 * @param {(import('$lib/types.d').User | null)[]} u 
 * @returns {boolean}
 */
function checkUsers(u) {
	return u.find((u) => u === null) === undefined;
}

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const userParams = [
	{
		name: 'additionalUsers',
		required: false,
		type: 'Users[]',
		_parser: async (s) => {
			let userLogins = s.split(',')
			let promises = userLogins.map((v) => getOrCreateUser(v))
			return await Promise.all(promises)
		},
		// @ts-ignore
		_checkFunction: checkUsers,
		_parseFailMessage: 'There is an invalid login!'
	}
]

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url }) {
	let [errorOccured, value] = await checkError(url.searchParams, userParams);
	if (errorOccured) throw error(500, value.error)
	const user = await getOrCreateUser(params.login);
	if (user === null) throw error(400, 'Invalid login!');

	/**
	 * @type {{additionalUsers: import('$lib/types.d').User[] | undefined}}
	 */
	let {additionalUsers} = value;
	additionalUsers = additionalUsers ?? []
	const users = [user, ...additionalUsers]
	return {
		users
	};
}

export const prerender = false;

export const ssr = false;

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
		type: 'string[]',
		_parser: async (s) => {
			let userLogins = s.split(',')
			let uniqueUserLogins = new Set(userLogins).values();
			return [...uniqueUserLogins]
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
	 * @type {{additionalUsers: string[] | undefined}}
	 */
	let {additionalUsers} = value;
	additionalUsers = additionalUsers ?? []
	additionalUsers = additionalUsers.filter((u) => u !== user.login);
	if(additionalUsers.length > 30){
		throw error(400, "Too many users. 30 is the maximum")
	}
	let promises = additionalUsers.map((v) => getOrCreateUser(v))
	let res = await Promise.all(promises)
	if(res.includes(null)){
		throw error(400, "Failed to parse parameter \"additionalUsers\": \"Unknown login.\"")
	}
	const users = [user, ...res]
	return {
		users
	};
}

export const prerender = false;

export const ssr = false;

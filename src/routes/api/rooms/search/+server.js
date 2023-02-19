import { checkError, parseRegex } from '$lib/server/utils';
import { getRooms } from '$lib/server/roomStore';
import { json } from '@sveltejs/kit';



/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const params = [
	{ name: 'searchRegex', required: false, type: 'regex', _parser: parseRegex, _checkFunction: async (r) => (typeof (r) === "object"), _parseFailMessage: "Not a valid regex!"},

];

/** @type {import('./$types').RequestHandler} */
export async function GET({url}){
	let [errorOccured, value] = await checkError(url.searchParams, params)
	if (errorOccured)
		return json(value, {status: 400});

	/**
	 * @type {{searchRegex: RegExp}}
	 */
	let { searchRegex } = value

	return json((await getRooms()).filter((r) => searchRegex.test(r.name)))
}
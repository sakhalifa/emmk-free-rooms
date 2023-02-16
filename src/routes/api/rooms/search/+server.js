import { checkError } from '$lib/server/utils';
import { getRooms } from '$lib/server/roomStore';
import { json } from '@sveltejs/kit';

/**
 * 
 * @param {string} str 
 */
function parseRegex(str){
	try{
		return new RegExp(str)
	}catch(e){
		return undefined
	}
}

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const params = [
	{ name: 'searchRegex', required: true, type: 'string', _parser: parseRegex, _checkFunction: (r) => (typeof(r) === "object")},

];

/** @type {import('./$types').RequestHandler} */
export async function GET({url}){
	let [errorOccured, value] = checkError(url.searchParams, params)
	if (errorOccured)
		return json(value, {status: 400});

	/**
	 * @type {{searchRegex: RegExp}}
	 */
	let { searchRegex } = value

	return json((await getRooms()).filter((r) => searchRegex.test(r.name)))
}
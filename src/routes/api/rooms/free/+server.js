import { checkError } from '$lib/server/utils';
import { json } from '@sveltejs/kit';
import { getTest } from '$lib/server/roomStore';
/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const params = [
	{ name: 'startHour', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'startMin', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'endHour', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'endMin', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'day', required: true, type: 'int', min: 0, max: 6, _parser: Number, _checkFunction: Number.isInteger },

];

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	let [errorOccured, value] = checkError(url, params)
	if (errorOccured)
		return json(value);
	return json({value: getTest()})
	
}

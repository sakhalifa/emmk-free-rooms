import { checkError } from '$lib/server/utils';
import { error, json } from '@sveltejs/kit';
import { getPlanningForRoom, getRooms } from '$lib/server/roomStore';

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
export async function GET({ url }) {
	let [errorOccured, value] = checkError(url.searchParams, params)
	if (errorOccured)
		return json(value);
	

	const room = (await getRooms()).find((r) => r.name.includes("I101"))
	if(room === undefined)
		throw error(500)
	return json({"test": await getPlanningForRoom(room, new Date("2023-02-20"), new Date("2023-02-20"))})
	
}

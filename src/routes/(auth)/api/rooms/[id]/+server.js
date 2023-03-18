import { getPlanningForRoom, getRooms } from '$lib/server/roomStore';
import { checkError, isValidDate } from '$lib/server/utils';
import { json } from '@sveltejs/kit';

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const roomParams = [
	{
		name: 'start',
		required: false,
		type: 'date',
		_parser: (s) => new Date(s),
		_checkFunction: (d) => (d instanceof Date ? isValidDate(d) : false),
		_parseFailMessage: "Not a valid ISO date! It's in format YYYY-MM-DD!"
	},
	{
		name: 'end',
		required: false,
		type: 'date',
		_parser: (s) => new Date(s),
		_checkFunction: (d) => (d instanceof Date ? isValidDate(d) : false),
		_parseFailMessage: "Not a valid ISO date! It's in format YYYY-MM-DD!"
	},
	{
		name: 'room',
		required: true,
		type: 'string',
		_parser: async (s) => (await getRooms()).find(r => r.id === Number(s)),
		_checkFunction: (u) => u !== undefined,
		_parseFailMessage: 'This room does not exist!'
	}
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	url.searchParams.set("room", params.id);
	let [errorOccured, value] = await checkError(url.searchParams, roomParams);
	if (errorOccured) return json(value, { status: 400 });

	/**
	 * @type {{start: Date, end: Date, room: import('$lib/server/ADE-client/src/types').Room}}
	 */
	let { start, end, room } = value;
	let planning = await getPlanningForRoom(room, start, end)
	return json(planning)
}
import { checkError, parseRegex, dateRangeOverlaps, isValidDate, removePrivateParameters } from '$lib/server/utils';
import { json } from '@sveltejs/kit';
import { getPlanningForRoom, getRooms } from '$lib/server/roomStore';

/**
 *
 * @param {string} s
 */
function createDateUTC(s) {
	const incorrectD = new Date(s);
	return new Date(
		Date.UTC(
			incorrectD.getFullYear(),
			incorrectD.getMonth(),
			incorrectD.getDate(),
			incorrectD.getHours(),
			incorrectD.getMinutes(),
			incorrectD.getSeconds(),
			incorrectD.getMilliseconds()
		)
	);
}

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const params = [
	{
		name: 'start',
		required: true,
		type: 'date',
		_parser: createDateUTC,
		_checkFunction: (d) => (d instanceof Date ? isValidDate(d) : false),
		_parseFailMessage:
			'Not a valid Date! The string should be parseable by the JS default Date constructor'
	},
	{
		name: 'end',
		required: true,
		type: 'date',
		_parser: createDateUTC,
		_checkFunction: (d) => (d instanceof Date ? isValidDate(d) : false),
		_parseFailMessage:
			'Not a valid Date! The string should be parseable by the JS default Date constructor'
	},
	{
		name: 'searchRegex',
		required: false,
		type: 'regex',
		_parser: parseRegex,
		_checkFunction: (r) => typeof r === 'object',
		_parseFailMessage: 'Not a valid regex!'
	}
];

/**
 *
 * @param {Date} start
 * @param {Date} end
 * @param {import('$lib/server/ADE-client/src/types').Room[]} rooms
 * @returns {Promise<Response>}
 */
async function getFreeRooms(start, end, rooms) {
	/**
	 * @type import('$lib/server/ADE-client/src/types').Room[]
	 */
	const freeRooms = [];
	/**
	 * 
	 * @param {import('$lib/server/ADE-client/src/types').Room} r 
	 */
	async function addToFreeRooms(r){
		const plannings = await getPlanningForRoom(r, start, end)
		for (const planning of plannings) {
			let free = true;
			for (const ev of planning.events) {
				if (dateRangeOverlaps(start, end, ev.start, ev.end)) {
					free = false;
					break;
				}
			}
			if (free) {
				freeRooms.push(r);
			}
		}
	}
	
	/** @type  {Promise<import('$lib/types.d').PlanningOfDay[]>[]}*/
	const promises = [];
	for (const r of rooms) {
		// @ts-ignore
		promises.push(addToFreeRooms(r))
		// 
	}
	await Promise.all(promises)
	return json(freeRooms);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let [errorOccured, value] = await checkError(url.searchParams, params);
	if (errorOccured) return json(value, { status: 400 });

	/**
	 * @type {{start: Date, end: Date, searchRegex:RegExp}}
	 */
	let { start, end, searchRegex } = value;

	if(start >= end)
		return json({ status: "INVALID PARAMETERS", error: "Cannot have start >= end!", params: removePrivateParameters(params) })
	const rooms = (await getRooms()).filter((r) => (searchRegex ? searchRegex.test(r.name) : true));
	return await getFreeRooms(start, end, rooms);
}

import { checkError, getMonday, getSaturday, parseRegex } from '$lib/server/utils';
import { error, json } from '@sveltejs/kit';
import { getPlanningForRoom, getRooms } from '$lib/server/roomStore';
import { PlanningOfWeek } from '$lib/server/types.d';
import { newDate } from '$lib/server/utils';

/**
 * @type {import('$lib/server/types.d').ParamType[]}
 */
const params = [
	{ name: 'startHour', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'startMin', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'endHour', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'endMin', required: true, type: 'int', min: 0, max: 60, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'day', required: false, type: 'int', min: 0, max: 6, _parser: Number, _checkFunction: Number.isInteger },
	{ name: 'searchRegex', required: false, type: 'string', _parser: parseRegex, _checkFunction: (r) => (typeof (r) === "object") },

];

/**
 * 
 * @param {number} startHour 
 * @param {number} startMin 
 * @param {number} endHour 
 * @param {number} endMin 
 * @param {number} day
 * @param {import('$lib/server/ADE-client').Room[]} rooms
 * @returns {Promise<Response>} 
 */
async function getFreeRooms(startHour, startMin, endHour, endMin, day, rooms) {
	const start = newDate(startHour, startMin, day+1)
	const end = newDate(endHour, endMin, day+1)

	const monday = getMonday(start)
	const saturday = getSaturday(start)
	/**
	 * @type {{[key: string]: import('$lib/server/types.d').PlanningOfWeek}}
	 */
	const roomPlannings = {}
	const myR = rooms.find(r => r.name.includes("I107"))
	for (const r of rooms) {
		if (r === myR) {
			console.log(r.name)
			console.log(monday)
			console.log(saturday)
		}
		roomPlannings[r.id] = new PlanningOfWeek(await getPlanningForRoom(r, monday, saturday))
	}
	if (myR === undefined)
		throw error(500)

	return json(roomPlannings[myR.id])

}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let [errorOccured, value] = checkError(url.searchParams, params)
	if (errorOccured)
		return json(value, { status: 400 });

	/**
	 * @type {{startHour: number, startMin: number, endHour:number, endMin:number, day:number, searchRegex:RegExp}}
	 */
	let { startHour, startMin, endHour, endMin, day, searchRegex } = value
	if (day === undefined && new Date().getDay() === 0) {
		throw error(400, "Cannot use API on sunday. Please specify a day. 0 for Monday to 5 for Saturday")
	}
	if (day === undefined)
		day = new Date().getDay() + 1
	const rooms = (await getRooms()).filter((r) => searchRegex ? searchRegex.test(r.name) : true)
	return (await getFreeRooms(startHour, startMin, endHour, endMin, day, rooms))


	const r = (await getRooms()).find((r) => r.name.includes("I101"))
	if (r === undefined)
		throw error(500)
	return json(await getPlanningForRoom(r, new Date("2023-02-20"), new Date("2023-02-20")))
}

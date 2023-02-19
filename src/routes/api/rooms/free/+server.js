import { checkError, parseRegex, dateRangeOverlaps } from '$lib/server/utils';
import { error, json } from '@sveltejs/kit';
import { getPlanningForRoom, getRooms } from '$lib/server/roomStore';
import { setDayOfWeek } from '$lib/server/utils';

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
 * @param {Date} refDate
 * @param {import('$lib/server/ADE-client').Room[]} rooms
 * @returns {Promise<Response>} 
 */
async function getFreeRooms(startHour, startMin, endHour, endMin, refDate, rooms) {
	const startDate = new Date(refDate)
	startDate.setHours(startHour, startMin, 0, 0)
	const endDate = new Date(refDate)
	endDate.setHours(endHour, endMin, 0, 0)

	const myR = rooms.find(r => r.name.includes("I107"))
	/**
	 * @type import('$lib/server/ADE-client').Room[]
	 */
	const freeRooms = []
	for (const r of rooms) {
		console.log(`fetching ${r.name}`)

		// @ts-ignore
		const planning = (await getPlanningForRoom(r, startDate, startDate))[0]

		console.log(`Doing range check...`)
		let free = true
		for (const ev of planning.events) {
			if (dateRangeOverlaps(startDate, endDate, ev.start, ev.end)) {
				free = false
				break
			}
		}
		if (free) {
			console.log(`Room ${r.name} is free between `)
			freeRooms.push(r)
		}
	}

	if (myR === undefined)
		throw error(500)

	return json(freeRooms)

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
		day = new Date().getDay()
	else
		day += 1
	
	const rooms = (await getRooms()).filter((r) => searchRegex ? searchRegex.test(r.name) : true)
	return await getFreeRooms(startHour, startMin, endHour, endMin, setDayOfWeek(day, new Date("2023-02-20")), rooms)


	// const r = (await getRooms()).find((r) => r.name.includes("I101"))
	// if (r === undefined)
	// 	throw error(500)
	// return json(await getPlanningForRoom(r, new Date("2023-02-20"), new Date("2023-02-27")))
}

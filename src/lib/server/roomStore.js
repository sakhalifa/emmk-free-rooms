import { readFile } from 'fs/promises'
import { convertDateToISODay, getDaysArray } from './utils';
import { createClient } from "./ADE-client";
import { getOrRevalidate } from './cache';
import { PlanningOfDay } from './types.d';

/**
 * @type {import('./ADE-client').Room[] | undefined}
 */
let rooms = undefined
/**
 * @returns {Promise<import('./ADE-client').Room[]>}
 */
async function getRoomsFromFile() {
	let jsonStr = await readFile("./data/rooms.json")

	/**
	 * @type import('./ADE-client').Room[]
	 */
	let r = JSON.parse(jsonStr.toString())
	return r;

}

async function refreshRooms() {
	rooms = await getRoomsFromFile()
}

/**
 * 
 * @returns {Promise<import('./ADE-client').Room[]>}
 */
async function getRooms() {
	if (rooms === undefined)
		await refreshRooms()

	// @ts-ignore
	return rooms
}

/**
 * Gets the planning of the room between `start` and `end`.
 * Will skip all sundays.
 * 
 * @param {import('./ADE-client').Room} room 
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<PlanningOfDay[]>}
 */
async function getPlanningForRoom(room, start, end) {
	const MS_IN_SEC = 1000
	const SEC_IN_MIN = 60
	const MIN_IN_HOUR = 60
	const daysArray = getDaysArray(start, end)
	/**@type {Promise<PlanningOfDay>[]} */
	const promises = []
	for(const day of daysArray){
		if(day.getDay() === 0)
			continue;
		promises.push(getOrRevalidate(
			`${room.id}:${convertDateToISODay(day)}`,
			MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * 5, //ttl of 5h,
			async (key) => {
				const [id, dayStr] = key.split(":")
				const client = createClient()
				const day = new Date(dayStr)
				return new PlanningOfDay(await client.getPlanningForResource(id, day, day))
			}
		))
	}
	let vals = await Promise.all(promises)
	
	return vals
}
export { getRooms, refreshRooms, getPlanningForRoom }
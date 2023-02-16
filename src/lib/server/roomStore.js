import { readFile } from 'fs/promises'
import { convertDateToISODay } from './utils';
import { createClient } from "./ADE-client";
import { getOrRevalidate } from './cache';

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
 * Can't get precise hourly planning tho
 * 
 * @param {import('./ADE-client').Room} room 
 * @param {Date} start
 * @param {Date} end
 * @returns 
 */
async function getPlanningForRoom(room, start, end) {
	const MS_IN_SEC = 1000
	const SEC_IN_MIN = 60
	const MIN_IN_HOUR = 60
	let val = await getOrRevalidate(
		`${room.id}:${convertDateToISODay(start)}:${convertDateToISODay(end)}`,
		MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * 5, //ttl of 5h
		async (key) => {
			console.log("cache miss :flushed:")
			const [id, startStr, endStr] = key.split(":")
			const client = createClient()
			const start = new Date(startStr)
			const end = new Date(endStr)
			return (await client.getPlanningForResource(id, start, end))
		})
	
	return val
}
export { getRooms, refreshRooms, getPlanningForRoom }
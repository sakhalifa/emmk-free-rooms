import { readFile } from 'fs/promises';
import { getDaysArray } from './utils';
import { convertDateToISODay } from '../utils';
import { getOrRevalidate } from './cache';
import { PlanningOfDay } from '../types.d';
import { createClient } from './ADE-client/src/clients/ADEClient';
import { CAS_LOGIN, CAS_PASSWORD } from '$env/static/private';

/**
 * @type {import('./ADE-client/src/types').Room[] | undefined}
 */
let rooms = undefined;
/**
 * @returns {Promise<import('./ADE-client/src/types').Room[]>}
 */
async function getRoomsFromFile() {
	let jsonStr = await readFile('./data/rooms.json');

	/**
	 * @type import('./ADE-client/src/types').Room[]
	 */
	let r = JSON.parse(jsonStr.toString());
	return r;
}

async function refreshRooms() {
	rooms = await getRoomsFromFile();
}

/**
 *
 * @returns {Promise<import('./ADE-client/src/types').Room[]>}
 */
async function getRooms() {
	if (rooms === undefined) await refreshRooms();

	// @ts-ignore
	return rooms;
}

/**
 * Gets the planning of the room between `start` and `end`.
 * Will skip all sundays.
 *
 * @param {import('./ADE-client/src/types').Room} room
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<PlanningOfDay[]>}
 */
async function getPlanningForRoom(room, start, end) {
	const MS_IN_SEC = 1000;
	const SEC_IN_MIN = 60;
	const MIN_IN_HOUR = 60;
	const daysArray = getDaysArray(start, end);
	/**@type {Promise<PlanningOfDay>[]} */
	const promises = [];
	for (const day of daysArray) {
		if (day.getDay() === 0) continue;
		promises.push(
			getOrRevalidate(
				`${room.id}:${convertDateToISODay(day)}`,
				MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * 5, //ttl of 5h,
				async ({ key }) => {
					const [idStr, dayStr] = key.split(':');
					const id = Number.parseInt(idStr);
					const client = await createClient(CAS_LOGIN, CAS_PASSWORD);
					const day = new Date(dayStr);
					return new PlanningOfDay(await client.getRoomPlanning(id, day, day));
				}
			)
		);
	}
	let vals = await Promise.all(promises);

	return vals;
}
export { getRooms, refreshRooms, getPlanningForRoom };

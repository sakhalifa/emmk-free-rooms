import { readFile } from 'fs/promises';
import { checkGapLessOrThrow, getDaysArray } from './utils';
import { convertDateToISODay } from '../utils';
import { PlanningOfDay, type Room } from '../types.d';
import { createClient } from './ADE-client/src/clients/ADEClient';
import { CAS_LOGIN, CAS_PASSWORD } from '$env/static/private';
import { LRUCache } from 'lru-cache';

const MS_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;

const roomPlanningCache = new LRUCache<string, PlanningOfDay>({
	max: 2000,
	ttl: MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * 5,
	fetchMethod: async (key, oldValue, { signal }) => {
		const [idStr, dayStr] = key.split(':');
		const id = Number.parseInt(idStr);
		const client = await createClient(CAS_LOGIN, CAS_PASSWORD);
		const day = new Date(dayStr);
		return new PlanningOfDay(await client.getRoomPlanning(id, day, day));
	}
});

let rooms: Room[] | undefined = undefined;

/**
 * @returns {Promise<import('./ADE-client/src/types').Room[]>}
 */
async function getRoomsFromFile(): Promise<Room[]> {
	let jsonStr = await readFile('./data/rooms.json');

	let r: Room[] = JSON.parse(jsonStr.toString());
	return r;
}

async function refreshRooms() {
	rooms = await getRoomsFromFile();
}


async function getRooms(): Promise<Room[]> {
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
 */
async function getPlanningForRoom(room: Room, start: Date, end: Date) {
	checkGapLessOrThrow(start, end);
	const daysArray = getDaysArray(start, end);
	/**@type {Promise<PlanningOfDay>[]} */
	const promises = [];
	for (const day of daysArray) {
		if (day.getDay() === 0) continue;
		promises.push(
			roomPlanningCache.fetch(`${room.id}:${convertDateToISODay(day)}`)
		);
	}
	let vals = await Promise.all(promises);
	return vals;
}
export { getRooms, refreshRooms, getPlanningForRoom };

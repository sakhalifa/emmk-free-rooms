import { CAS_LOGIN, CAS_PASSWORD } from '$env/static/private';
import { createClient } from './ADE-client/src/clients/ADEClient';
import { PlanningOfDay, type User } from '../types.d';
import { checkGapLessOrThrow, getDaysArray } from './utils';
import { convertDateToISODay } from '../utils';
import { CLEAN_USERS_TIMER } from '$env/static/private';
import { LRUCache } from 'lru-cache';

const userPlanningCache = new LRUCache<string, PlanningOfDay>({
	max: 2000,
	ttl: 1000 * 60 * 60,
	fetchMethod: async (key, oldValue, { signal }) => {
		const [idStr, dayStr] = key.split(':');
		const id = Number.parseInt(idStr);
		const date = new Date(dayStr);
		let c = await createClient(CAS_LOGIN, CAS_PASSWORD);
		return new PlanningOfDay(await c.getStudentPlanning(id, date, date));
	}
});

let users: Map<string, User | null> = new Map();

// eslint-disable-next-line no-unused-vars
const cleanWorker = setInterval(() => {
	let toDelete = new Set<string>();
	for (const [k, v] of users) {
		if (v === null) toDelete.add(k);
	}
	for (const k of toDelete) users.delete(k);
}, Number.parseInt(CLEAN_USERS_TIMER));

async function getOrCreateUser(login: string): Promise<User | null> {
	if (users.has(login)) {
		const val = users.get(login);
		return val ?? null; // Only to remove warning...
	}
	let c = await createClient(CAS_LOGIN, CAS_PASSWORD);
	try {
		const val = { id: await c.getADEId(login), login };
		if (!val?.id) {
			users.set(login, null);
			return null; // Return null if the id is 0.
		}
		users.set(login, val);
		return val;
	} catch (e) {
		users.set(login, null);
		return null;
	}
}

/**
 *
 * @param {import("../types.d").User} user
 * @param {Date} start
 * @param {Date} end
 */
async function getPlanningForUser(user: User, start: Date, end: Date) {
	checkGapLessOrThrow(start, end);
	/** @type {Promise<import("../types.d").PlanningOfDay>[]} */
	const promises = [];

	const days = getDaysArray(start, end);
	for (const day of days) {
		if (day.getDay() === 0) continue;
		const planning = userPlanningCache.fetch(`${user.id}:${convertDateToISODay(day)}`);
		promises.push(planning);
	}

	return await Promise.all(promises);
}

export { getOrCreateUser, getPlanningForUser };

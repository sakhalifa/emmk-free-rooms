import { CAS_LOGIN, CAS_PASSWORD } from '$env/static/private';
import { createClient } from './ADE-client/src/clients/ADEClient';
import { getOrRevalidate } from './cache';
import { PlanningOfDay } from '../types.d';
import { getDaysArray } from './utils';
import { convertDateToISODay } from '../utils';
import { CLEAN_USERS_TIMER } from '$env/static/private';

/** @type Map<string, import('../types.d').User | null>*/
let users = new Map();

// eslint-disable-next-line no-unused-vars
const cleanWorker = setInterval(() => {
	let toDelete = new Set();
	for (const [k, v] of users) {
		if (v === null) toDelete.add(k);
	}
	for (const k of toDelete) users.delete(k);
}, Number.parseInt(CLEAN_USERS_TIMER));

/**
 *
 * @param {string} login
 * @returns {Promise<import("../types.d").User | null>} returns a user object if it's a valid login, else null.
 */
async function getOrCreateUser(login) {
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
async function getPlanningForUser(user, start, end) {
	if(end.getTime() - start.getTime() > 60 * 60 * 24 * 31){
		throw new Error("Nope!");
	}
	/** @type {Promise<import("../types.d").PlanningOfDay>[]} */
	const promises = [];

	const days = getDaysArray(start, end);
	for (const day of days) {
		if (day.getDay() === 0) continue;
		const planning = getOrRevalidate(
			`${user.id}:${convertDateToISODay(day)}`,
			1000 * 60 * 60,
			async ({ key }) => {
				const [idStr, dayStr] = key.split(':');
				const id = Number.parseInt(idStr);
				const date = new Date(dayStr);
				let c = await createClient(CAS_LOGIN, CAS_PASSWORD);
				return new PlanningOfDay(await c.getStudentPlanning(id, date, date));
			}
		);
		promises.push(planning);
	}

	return await Promise.all(promises);
}

export { getOrCreateUser, getPlanningForUser };

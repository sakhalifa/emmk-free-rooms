import { CAS_LOGIN, CAS_PASSWORD } from "$env/static/private"
import { createClient } from "./ADE-client"
import { getOrRevalidate } from "./cache"
import { PlanningOfDay } from "./types.d"
import { convertDateToISODay, getDaysArray } from "./utils"

/** @type Map<string, import('./types.d').User>*/
let users = new Map()

/**
 * 
 * @param {string} login 
 * @returns {Promise<import("./types.d").User | null>} returns a user object if it's a valid login, else null.
 */
async function getOrCreateUser(login) {
	if (users.has(login)){
		const val = users.get(login)
		return val ?? null // Only to remove warning...
	}
	let c = createClient()
	await c.initializeADEConnection(CAS_LOGIN, CAS_PASSWORD)
	await c.sendConnectionRequest();
	await c.initProject();
	try {
		const val = { id: (await c.getADEId(login)) }
		if(!val?.id)
			return null // Return null if the id is 0.
		users.set(login, val)
		return val
	}
	catch (e) {
		return null
	}
}

/**
 * 
 * @param {import("./types.d").User} user 
 * @param {Date} start 
 * @param {Date} end 
 */
async function getPlanningForUser(user, start, end) {
	/** @type {import("./types.d").PlanningOfDay[]} */
	const plannings = []

	const days = getDaysArray(start, end)
	for(const day of days){
		const planning = await getOrRevalidate(
			`${user.id}:${convertDateToISODay(day)}`,
			1000 * 60 * 60,
			async ({key}) => {
				const [id, dayStr] = key.split(":")
				const date = new Date(dayStr)
				let c = createClient()
				return new PlanningOfDay(await c.getPlanningForResource(id, date, date))
			}
		)
		plannings.push(planning)
	}

	return plannings
}

export { getOrCreateUser, getPlanningForUser }
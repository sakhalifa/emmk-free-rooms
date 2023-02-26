import { convertDateToISODay } from '$lib/utils';

/**
 * 	
 * @param {Date} d1 
 * @param {Date} d2 
 */
function dateMax(d1, d2) {
	return d1 > d2 ? d1 : d2;
}

/**
 * 	
 * @param {Date} d1 
 * @param {Date} d2 
 */
function dateMin(d1, d2) {
	return d1 < d2 ? d1 : d2;
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, fetch }) => {
		let data = await request.formData()
		const firstDateStr = data.get("firstDate")
		const secondDateStr = data.get("secondDate")
		const regex = data.get("regex")
		if (regex !== null) {
			try {
				new RegExp(regex.toString())
			} catch {
				return { error: "Pas une regex valide! https://regex101.com/ pour tester des regex" }
			}
		}

		if (firstDateStr === null)
			return { error: "Date de début manquante!" };
		if (secondDateStr === null)
			return { error: "Date de fin manquante!" };
		const firstDate = dateMin(new Date(firstDateStr.toString()), new Date(secondDateStr.toString()))
		const lastDate = dateMax(new Date(firstDateStr.toString()), new Date(secondDateStr.toString()))
		if (convertDateToISODay(firstDate) !== convertDateToISODay(lastDate))
			return { error: "Les 2 dates doivent être exactement sur le même jour!" };
		/** @type {import('$lib/types.d').Room[]} */
		let rooms = await (await fetch(`/api/rooms/free?start=${firstDate.toISOString()}&end=${lastDate.toISOString()}`
			+ (regex ? `&searchRegex=${regex.toString()}` : ""))).json()
		return { rooms }
	}
};
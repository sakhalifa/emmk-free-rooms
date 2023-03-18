<script>
	import MyCalendar from '$lib/MyCalendar.svelte';
	import { convertDateToISODay, getColorFromType } from '$lib/utils';

	/** @type import('./$types').PageData*/
	export let data;

	/**
	 *
	 * @param {Date} start
	 * @param {Date} end
	 * @returns {Promise<import('$lib/types.d').CalendarEvent[]>}
	 */
	async function fetcher(start, end) {
		return fetch(
			`/api/rooms/${data.room.id}?start=${convertDateToISODay(start)}&end=${convertDateToISODay(
				end
			)}`
		)
			.then((r) => r.json())
			.then((d) => {
				/** @type import('$lib/types.d').PlanningOfDay[]*/
				const plannings = d;
				/** @type {import('$lib/types.d').CalendarEvent[]}*/
				const events = [];
				for (const planning of plannings) {
					for (const ev of planning.events) {
						events.push({
							id: ev.description.id,
							start: new Date(ev.start),
							end: new Date(ev.end),
							titleHTML: `<span class="title-bold">${ev.summary}</span><br>${
								ev.location?.replaceAll(',', '<br>') ?? ''
							}`,
							color: getColorFromType(ev.description.type),
							extendedProps: {
								type: ev.description.type
							}
						});
					}
				}
				return events;
			});
	}
</script>

<h1>{data.room.name}</h1>
<MyCalendar {fetcher} />

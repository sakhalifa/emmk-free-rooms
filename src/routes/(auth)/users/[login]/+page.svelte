<script context="module">
	import { convertDateToISODay, getColorFromType } from '$lib/utils';
	import MyCalendar from '$lib/MyCalendar.svelte';
</script>

<script lang="js">
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
			`/api/users/${data.users[0].login}?start=${convertDateToISODay(
				start
			)}&end=${convertDateToISODay(end)}`
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

<MyCalendar {fetcher} />

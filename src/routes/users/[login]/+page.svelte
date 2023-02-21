<script context="module">
	import { convertDateToISODay } from '$lib/utils';
</script>

<script lang="js">
	import MyCalendar from '$lib/MyCalendar.svelte';

	/** @type import('./$types').PageData*/
	export let data;

	/**
	 *
	 * @param {string | null} type
	 */
	function getColorFromType(type) {
		switch (type) {
			case 'CM':
				return 'yellow';
			case 'CI':
				return 'lime';
			case 'TD':
				return 'cyan';
			case 'ENSEIGNANTS':
				return 'red';
			case 'TP':
				return 'lightgray';
			default:
				return '';
		}
	}

	/**
	 *
	 * @param {{start: Date, end: Date}} fetchInfo
	 * @param {(_: any[]) => void} successCallback
	 */
	function fetchEvents(fetchInfo, successCallback) {
		let { start, end } = fetchInfo;
		start = new Date(start);
		end = new Date(end);
		if (start.getDay() === 0) {
			start.setDate(start.getDate() + 1);
			end.setDate(end.getDate() + 1);
		}
		fetch(
			`/api/users/${data.user?.login ?? 'a'}?start=${convertDateToISODay(
				start
			)}&end=${convertDateToISODay(end)}`
		)
			.then((r) => r.json())
			.then((d) => {
				/** @type import('$lib/types.d').PlanningOfDay[]*/
				const plannings = d;
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
				successCallback(events);
			});
	}
</script>

<MyCalendar {fetchEvents} />
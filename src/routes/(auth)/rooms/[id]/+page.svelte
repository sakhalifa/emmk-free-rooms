<script>
	import MyCalendar from '$lib/MyCalendar.svelte';
	import { convertDateToISODay } from '$lib/utils';

	/** @type import('./$types').PageData*/
	export let data;

	/**
	 *
	 * @param {Date} start
	 * @param {Date} end
	 */
	function getUrl(start, end) {
		return `/api/rooms/${data.room.id}?start=${convertDateToISODay(
			start
		)}&end=${convertDateToISODay(end)}`;
	}
</script>

<h1>{data.room.name}</h1>
<MyCalendar {getUrl} />

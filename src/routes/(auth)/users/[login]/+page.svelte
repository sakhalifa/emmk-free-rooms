<script context="module">
	import { convertDateToISODay } from '$lib/utils';
</script>

<script lang="js">
	import MyCalendar from '$lib/MyCalendar.svelte';

	/** @type import('./$types').PageData*/
	export let data;

	/**
	 *
	 * @param {Date} start
	 * @param {Date} end
	 */
	function getUrl(start, end) {
		return `/api/users/${data.user.login}?start=${convertDateToISODay(
			start
		)}&end=${convertDateToISODay(end)}`;
	}
</script>

<MyCalendar {getUrl} />

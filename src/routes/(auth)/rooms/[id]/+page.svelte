<script>
	import MyCalendar from '$lib/MyCalendar.svelte';

	/** @type import('./$types').PageData*/
	export let data;

	function getUrl(){}
</script>

<h1>{data.room.name}</h1>
<!-- <MyCalendar {fetchEvents} /> -->

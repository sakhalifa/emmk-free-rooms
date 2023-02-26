<script>

	/** @type {import("$lib/types.d").Room[]}*/
	export let selectedRooms;
</script>

<ul class="rooms">
	{#each selectedRooms as room}
		<li>{room.name}</li>
	{/each}
</ul>

<style>
	ul{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	li{
		padding: 1em;
	}
</style>
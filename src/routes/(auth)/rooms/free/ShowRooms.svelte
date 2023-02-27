<script>
	/** @type {import("$lib/types.d").Room[]}*/
	export let selectedRooms;
</script>

<div class="rooms">
	<ul>
		{#each selectedRooms as room}
			<li><a href="/rooms/{room.id}" target="_blank" rel="noreferrer">{room.name}</a></li>
		{/each}
	</ul>
</div>

<style>
	a {
		text-decoration: none;
		color: black;
	}
	a:hover {
		cursor: pointer;
		text-decoration: underline;
	}
	.rooms {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	li {
		padding: 1em;
	}
</style>

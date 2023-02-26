<script>
	import FreeRoomsPage from './FreeRoomsPage.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type string | undefined */
	let error;
</script>

{#if form?.error}
	<div class="error">
		{form.error}
	</div>
{/if}
{#if !form?.rooms}
	<form method="post">
		<input type="text" placeholder="Room name regex" name="regex" />
		<input type="datetime-local" name="firstDate" required />
		<input type="datetime-local" name="secondDate" required />
		<button type="submit">Submit</button>
	</form>
{:else}
	<FreeRoomsPage rooms={form.rooms} />
{/if}

<style>
	.error {
		color: red;
	}
</style>

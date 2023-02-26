<script>
	import FreeRoomsPage from './FreeRoomsPage.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {HTMLInputElement}*/
	let firstInputRef;

	/** @type {HTMLInputElement}*/
	let secondInputRef;

	/**
	 *
	 * @param {Event & {currentTarget: EventTarget & HTMLInputElement}} ev
	 */
	function syncInputs(ev) {
		const myInput = ev.currentTarget;
		const otherInput = myInput === firstInputRef ? secondInputRef : firstInputRef;

		const myDate = myInput.valueAsDate;
		if(myDate === null) return;
		const otherDate = otherInput.valueAsDate;
		if(otherDate === null)
			otherInput.value = myInput.value;
		otherInput.value = myInput.value.split("T")[0] + "T" + otherInput.value.split("T")[1];
		
	}
</script>

{#if form?.error}
	<div class="error">
		{form.error}
	</div>
{/if}
{#if !form?.rooms}
	<form method="post">
		<input type="text" placeholder="Room name regex" name="regex" />
		<input
			bind:this={firstInputRef}
			type="datetime-local"
			name="firstDate"
			required
			on:change={syncInputs}
		/>
		<input
			bind:this={secondInputRef}
			type="datetime-local"
			name="secondDate"
			required
			on:change={syncInputs}
		/>
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

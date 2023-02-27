<script>
	import { browser } from '$app/environment';
	import FreeRoomsPageComputer from './FreeRoomsPageComputer.svelte';
	import FreeRoomsPageMobile from './FreeRoomsPageMobile.svelte';
	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {HTMLInputElement}*/
	let firstInputRef;

	/** @type {HTMLInputElement}*/
	let secondInputRef;

	let component = FreeRoomsPageComputer;
	if (browser) {
		const mql = window.matchMedia('(max-width: 600px)');
		if (mql.matches) {
			component = FreeRoomsPageMobile;
		} else {
			component = FreeRoomsPageComputer;
		}
		mql.addEventListener('change', (e) => {
			const mobileView = e.matches;
			if (mobileView) {
				component = FreeRoomsPageMobile;
			} else {
				component = FreeRoomsPageComputer;
			}
		});
	}

	/**
	 *
	 * @param {Event & {currentTarget: EventTarget & HTMLInputElement}} ev
	 */
	function syncInputs(ev) {
		const myInput = ev.currentTarget;
		const otherInput = myInput === firstInputRef ? secondInputRef : firstInputRef;

		const myDate = myInput.valueAsDate;
		if (myDate === null) return;
		const otherDate = otherInput.valueAsDate;
		if (otherDate === null) otherInput.value = myInput.value;
		otherInput.value = myInput.value.split('T')[0] + 'T' + otherInput.value.split('T')[1];
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
			value={new Date().toISOString().split(':').splice(0, 2).join(':')}
			required
			on:change={syncInputs}
		/>
		<input
			bind:this={secondInputRef}
			type="datetime-local"
			name="secondDate"
			value={new Date().toISOString().split(':').splice(0, 2).join(':')}
			required
			on:change={syncInputs}
		/>
		<button type="submit">Submit</button>
	</form>
{:else}
	<svelte:component this={component} rooms={form.rooms} />
{/if}

<style>
	.error {
		color: red;
	}
</style>

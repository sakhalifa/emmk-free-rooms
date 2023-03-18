<script>
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
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

	let loading = false;

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
	{#if loading}
		<div id="overlay">Page loading...</div>
	{:else}
		<form
			method="post"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
		>
			<input type="text" placeholder="Room name regex" name="regex" />
			<input
				bind:this={firstInputRef}
				type="datetime-local"
				name="firstDate"
				value={(() => {
					let d = new Date();
					d.setUTCHours(d.getUTCHours(), 0, 0, 0);
					return d;
				})()
					.toISOString()
					.split(':')
					.splice(0, 2)
					.join(':')}
				required
				on:change={syncInputs}
			/>
			<input
				bind:this={secondInputRef}
				type="datetime-local"
				name="secondDate"
				value={(() => {
					let d = new Date();
					d.setUTCHours(d.getUTCHours() + 2, 0, 0, 0);
					return d;
				})()
					.toISOString()
					.split(':')
					.splice(0, 2)
					.join(':')}
				required
				on:change={syncInputs}
			/>
			<button type="submit">Submit</button>
		</form>
	{/if}
{:else}
	<svelte:component this={component} rooms={form.rooms} />
{/if}

<style>
	.error {
		color: red;
	}
	#overlay {
		margin: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;
		background-color: rgba(211, 211, 211, 0.5);
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

<script>
	let inputValue = '';
	let action = `/users/${inputValue}`;
	let submitted = false;
</script>

{#if !submitted}
	<form
		method="get"
		action="/users/{inputValue}"
		on:submit={() => {
			submitted = true;
		}}
	>
		<input
			type="text"
			placeholder="Your CAS login, for example 'skhalifa'"
			bind:value={inputValue}
		/>
		<button type="submit">Go to page</button>
	</form>
{:else}
	<p>Page is loading...</p>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	input {
		margin: 0.5em;
	}
	button {
		width: fit-content;
	}
</style>

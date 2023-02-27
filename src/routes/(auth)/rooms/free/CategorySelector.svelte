<script>

	/**
	 * @type import('./types').CategoryType[]
	 */
	export let categories;

	/** @type {(_: import('./types').CategoryType) => void}*/
	export let handleCategorySelect;
</script>

<div class="grid">
	{#each categories as category}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div style="background-color: {category.color}" class="column" on:click={() => handleCategorySelect(category)}>
			<div class="title">
				<span>{category.name}</span>
				<span>{category.rooms.length}</span>
			</div>
		</div>
	{/each}
</div>

<style>
	.grid {
		height: 100%;
		width: 100%;
		display: grid;
		grid-template: repeat(2, 1fr) / repeat(3, 1fr);
	}
	.column {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.column:hover {
		border: 2px black solid;
		cursor: pointer;
	}
	.title{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>

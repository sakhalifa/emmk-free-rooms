<script lang="js">
	import CategorySelector from './CategorySelector.svelte';

	/**
	 * @type import('./types').CategoryType[]
	 */
	let categories = [
		{ name: 'S', color: '#808080' },
		{ name: 'E', color: '#adff2f' },
		{ name: 'P', color: '#800080' },
		{ name: 'L', color: 'rgb(255, 165, 0)' },
		{ name: 'I', color: '#00ffff' },
		{ name: 'AMPHI', color: '#ffff00' }
	];

	/**
	 * @type import('./types').CategoryType | undefined
	 */
	let selectedCategory;

	/** @type {0 | 1 | 2 | undefined}*/
	let selectedFloor;

	/**
	 *
	 * @param {import('./types').CategoryType} category
	 */
	function handleCategorySelect(category) {
		selectedCategory = category;
	}

	/**
	 *
	 * @param {0 | 1 | 2} floor
	 */
	function handleFloorSelect(floor) {
		selectedFloor = floor;
	}
</script>

<div id="selector">
	{#if selectedCategory === undefined}
		<CategorySelector {categories} {handleCategorySelect} />
	{:else}
		<div class="content">
			<div style="background-color: {selectedCategory.color};" class="category">
				{selectedCategory.name}
			</div>
			{#if selectedFloor === undefined}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="grid">
					<div><div class="floor" on:click={() => handleFloorSelect(0)}>RDC</div></div>
					<div><div class="floor" on:click={() => handleFloorSelect(1)}>1er étage</div></div>
					<div><div class="floor" on:click={() => handleFloorSelect(2)}>2e étage</div></div>
				</div>
			{/if}
			<button
				on:click={() => {
					selectedCategory = undefined;
					selectedFloor = undefined;
				}}>Go back</button
			>
		</div>
	{/if}
</div>

<style>
	#selector {
		width: 100%;
		height: 100%;
	}
	.category {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1em;
	}
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		height: 20em;
		flex-grow: 1;
	}
	.floor {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.floor:hover {
		border: black 2px solid;
		cursor: pointer;
	}
</style>

<script lang="js">
	import CategorySelector from './CategorySelector.svelte';
	import ShowRooms from './ShowRooms.svelte';

	/** @type import('$lib/types.d').Room[]*/
	export let rooms;
	/**
	 *
	 * @param {string} name
	 */
	function createRoomRegex(name) {
		return new RegExp(`.*${name}[0-9]+.*`);
	}
	/**
	 * @type import('./types').CategoryType[]
	 */
	let categories = [
		{
			name: 'S',
			color: '#808080',
			categoryMatcher: (s) => createRoomRegex('S').test(s),
			rooms: []
		},
		{
			name: 'E',
			color: '#adff2f',
			categoryMatcher: (s) => createRoomRegex('E').test(s),
			rooms: []
		},
		{
			name: 'P',
			color: '#800080',
			categoryMatcher: (s) => createRoomRegex('P').test(s),
			rooms: []
		},
		{
			name: 'L',
			color: 'rgb(255, 165, 0)',
			categoryMatcher: (s) => createRoomRegex('L').test(s),
			rooms: []
		},
		{
			name: 'I',
			color: '#00ffff',
			categoryMatcher: (s) => createRoomRegex('I').test(s),
			rooms: []
		},
		{ name: 'AMPHI', color: '#ffff00', categoryMatcher: (s) => /.*AMPHI.*/g.test(s), rooms: [] }
	];

	for (let category of categories) {
		category.rooms = rooms.filter((r) => category.categoryMatcher(r.name));
	}
	/**
	 *
	 * @param {import('./types').CategoryType} category
	 * @param {(0 | 1 | 2 | undefined)} floor
	 * @returns {import('$lib/types.d').Room[]}
	 */
	function filterByFloor(category, floor) {
		if (category.name === 'AMPHI') return category.rooms;
		return category.rooms.filter((r) => {
			return Number.parseInt(r.name.split('-')[1].charAt(1)) === floor;
		});
	}
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
				{selectedCategory.name}<br />{selectedCategory.rooms.length}
			</div>
			{#if selectedFloor === undefined && selectedCategory.name !== 'AMPHI'}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="grid">
					<div>
						<div class="floor" on:click={() => handleFloorSelect(0)}>
							<span>RDC</span><span>{filterByFloor(selectedCategory, 0).length}</span>
						</div>
					</div>
					<div>
						<div class="floor" on:click={() => handleFloorSelect(1)}>
							<span>1er étage</span><span>{filterByFloor(selectedCategory, 1).length}</span>
						</div>
					</div>
					<div>
						<div class="floor" on:click={() => handleFloorSelect(2)}>
							<span>2e étage</span><span>{filterByFloor(selectedCategory, 2).length}</span>
						</div>
					</div>
				</div>
			{:else}
				<ShowRooms selectedRooms={filterByFloor(selectedCategory, selectedFloor)} />
			{/if}

			<button
				on:click={() => {
					selectedCategory = selectedFloor === undefined ? undefined : selectedCategory;
					selectedFloor = undefined;
				}}>Go back</button
			>
		</div>
	{/if}
</div>

<style>
	#selector > .content > :global(*:nth-child(2)) {
		flex-grow: 1;
	}
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
	}
	.floor {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.floor:hover {
		border: black 2px solid;
		cursor: pointer;
	}
</style>

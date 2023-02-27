<script>
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
</script>

<div id="maingrid">
	{#each categories as category}
		<div class="subgrid">
			<div style="background-color: {category.color}" id="title">{category.name}</div>
			<div class="floor">
				<ul>
					{#each filterByFloor(category, 0) as room}
					<li><a href="/rooms/{room.id}" target="_blank" rel="noreferrer">{room.name}</a></li>
					{/each}
				</ul>
			</div>
			<div class="floor">
				<ul>
					{#each filterByFloor(category, 1) as room}
					<li><a href="/rooms/{room.id}" target="_blank" rel="noreferrer">{room.name}</a></li>
					{/each}
				</ul>
			</div>
			<div class="floor">
				<ul>
					{#each filterByFloor(category, 2) as room}
					<li><a href="/rooms/{room.id}" target="_blank" rel="noreferrer">{room.name}</a></li>
					{/each}
				</ul>
			</div>
		</div>
	{/each}
</div>

<style>
	#maingrid {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
	}

	#title {
		text-align: center;
	}

	.subgrid {
		height: 100%;
		display: grid;
		grid-template-rows: min-content repeat(3, 1fr);
	}
	.floor {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	a {
		text-decoration: none;
		color: black;
	}
	a:hover {
		cursor: pointer;
		text-decoration: underline;
	}
</style>

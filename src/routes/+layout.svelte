<div id="main">
	<nav>
		<a href="/users">ADE</a>
		<a href="/"><i class="fa fa-home" style="font-size: x-large" /></a>
		<a href="/rooms/free">Salles libres</a>
	</nav>
	<main>
		<slot />
	</main>
	<footer>
		<span>Samuel Khalifa</span><a
			href="https://github.com/sakhalifa/emmk-free-rooms"
			target="_blank"
			rel="noreferrer"><i class="fa fa-github" /> Github</a
		>
	</footer>
</div>

<style>
	nav {
		display: flex;
		justify-content: space-around;
	}

	nav > a {
		text-decoration: none;
		color: black;
		border: solid gray;
		width: 5em;
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	}

	nav > a:hover {
		border: solid red;
	}

	footer {
		background-color: #039be5;
		display: flex;
		padding: 1em;
		justify-content: space-evenly;
	}

	footer > a {
		text-decoration: none;
		color: black;
	}

	#main {
		height: 99%;
		display: flex;
		flex-direction: column;
	}

	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>

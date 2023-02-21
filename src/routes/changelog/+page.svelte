<h1>Changelog</h1>
<h2>0.1, beta-release</h2>
<ul>
	<li>API pour avoir salles libres rustique (bientôt deprecated)</li>
	<li>API EDT utilisateur</li>
	<li>Page présentant l'API EDT Utilisateur</li>
</ul>
<h2>0.1.1, <span class="rainbow">C O U L E U R S</span></h2>
<ul>
	<li>Mise à jour librairie interne pour communiquer avec ADE</li>
	<li>
		Couleurs sur l'EDT en fonction du type du cours! (Mrc la MaJ de la librairie).<br />
		Si vous ne savez pas à quelle couleur correspond quoi, il y a le tooltip, ou alors...<br />
		La liste de <span class="rainbow">correspondance</span>:
		<table>
			<thead>
				<tr>
					<th>Couleur</th>
					<th>Type correspondant</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="red" />
					<td>Examen</td>
				</tr>
				<tr>
					<td class="yellow" />
					<td>CM</td>
				</tr>
				<tr>
					<td class="lime" />
					<td>CI</td>
				</tr>
				<tr>
					<td class="cyan" />
					<td>TD</td>
				</tr>
				<tr>
					<td class="lightgray" />
					<td>TP</td>
				</tr>
			</tbody>
		</table>
	</li>
</ul>

<style>
	.rainbow {
		color: transparent;
		background: linear-gradient(90deg, red, orange, yellow, green, blue, purple);
		background-clip: text;
		-webkit-background-clip: text;
	}

	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.5em;
	}

	.red {
		background-color: red;
	}
	.yellow {
		background-color: yellow;
	}
	.lime {
		background-color: lime;
	}
	.cyan {
		background-color: cyan;
	}
	.lightgray {
		background-color: lightgray;
	}
</style>

<h1>Changelog</h1>
<h2>0.1.3, Le fléau</h2>
<ul>
	<li>
		- Le site est désormais lock sous le CAS. Et oui, c'est dommage, mais soit c'est ça, soit je
		suis techniquement hors charte :(.
	</li>
	<li>- Une fois authentifié, vous avez accès au site</li>
</ul>
<h2>0.1.2.1, Thibaut stp...</h2>
<ul>
	<li>
		- Rajout d'un petit "Loading..." quand on utilise le calendrier, car certains <em>malotrus</em> ont
		décidé de spam 💀
	</li>
</ul>
<h2>0.1.2, Maintenabilité + Dépréciation</h2>
<ul>
	<li>- Un peu de refactoring pour le calendrier, pour quelque chose d'utile plus tard 👀</li>
	<li>
		- Résolution d'un bug qui faisait en sorte que des fois, quand on appuyait sur les flèches avec
		le clavier, ça le faisait 2x
	</li>
	<li>- Dépréciation de l'API pour les salles libres. L'API a changé lol.</li>
	<li>- Enfin une "délimitation" header main footer</li>
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
<h2>0.1, beta-release</h2>
<ul>
	<li>API pour avoir salles libres rustique (bientôt deprecated)</li>
	<li>API EDT utilisateur</li>
	<li>Page présentant l'API EDT Utilisateur</li>
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

<script>
	/** @type import('./$types').PageData*/
	export let data;
</script>

{#if data.success}
<p>Vous avez bien été déconnecté!</p>
{:else}
<p>Impossible de vous déconnecter... Peut-être n'êtes vous pas connecté.</p>
{/if}
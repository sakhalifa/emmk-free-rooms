<script>
	import { goto } from "$app/navigation";

	/** @type import('./$types').PageData*/
	export let data;

	goto(`/users/${data.session.user.user}`)
</script>

<p>Page is loading...</p>

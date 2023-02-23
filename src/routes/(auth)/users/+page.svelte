<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	/** @type import('./$types').PageData*/
	export let data;

	if (browser) {
		goto(`/users/${data.session.user.user}`);
	}
</script>

<p>Page is loading...</p>

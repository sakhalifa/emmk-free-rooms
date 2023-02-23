import { handleSession } from 'svelte-kit-cookie-session';
import { SESSION_SECRET_KEY } from '$env/static/private';

// You can do it like this, without passing a own handle function
export const handle = handleSession({
	// Optional initial state of the session, default is an empty object {}
	// init: (event) => ({
	// 	views: 0
	// }),
	secret: SESSION_SECRET_KEY,
	expires: 1
});
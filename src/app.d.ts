/// <reference types="@sveltejs/kit" />

interface SessionData {
	user: import('./lib/types.d').ADEUser;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import('svelte-kit-cookie-session').Session<SessionData>;
		}
		interface PageData {
			session: SessionData;
		}
		// interface Platform {}
	}
}

export {};

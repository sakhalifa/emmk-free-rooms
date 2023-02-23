import { CAS_PROXY, CAS_SERVER } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { XMLParser } from 'fast-xml-parser';

function getServiceURL(url: URL) {
	let newURL = new URL(url);
	newURL.searchParams.delete('ticket');
	newURL = new URL(newURL);
	return CAS_PROXY + encodeURI(newURL.href);
}

function getLoginURL(url: URL) {
	return CAS_SERVER + '/login?service=' + getServiceURL(url);
}

async function validateTicket(ticket: string, url: URL, fetcher: typeof fetch) {
	const serviceUrl =
		'https://cas.bordeaux-inp.fr/serviceValidate' +
		`?ticket=${ticket}&service=${getServiceURL(url)}`;
	let r = await fetcher(serviceUrl);
	let t = await r.text();
	const xmlResp = new XMLParser({ transformTagName: (s) => s.split(':')[1] }).parse(t);
	if (!xmlResp.serviceResponse.authenticationSuccess) {
		url.searchParams.delete('ticket');
		throw redirect(302, new URL(url).href);
	} else {
		/** @type {import('$lib/types.d').ADEUser} */
		const user = xmlResp.serviceResponse.authenticationSuccess;
		return user;
	}
}

async function login(url: URL) {
	throw redirect(302, CAS_SERVER + '?service=' + getServiceURL(url));
}

async function handleCASLogin(url: URL, fetcher: typeof fetch, locals: App.Locals) {
	if (!locals.session.data.user) {
		if (url.searchParams.get('ticket')) {
			// @ts-ignore
			let adeUser = await validateTicket(url.searchParams.get('ticket'), url, fetcher);
			await locals.session.set({ user: adeUser });
		} else await login(url);
	}

	return {
		session: locals.session.data
	};
}

export { handleCASLogin };

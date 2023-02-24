import { getRooms } from '$lib/server/roomStore';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const idNum = Number(params.id);
	if (!Number.isInteger(idNum)) throw error(400, 'Invalid id! Must be an integer.');
	const rooms = await getRooms();
	let room = rooms.find((r) => r.id === idNum);
	if (room === undefined) throw error(400, `Cannot find room with id ${params.id}`);
	return {
		room
	};
}

export const prerender = false;

export const ssr = false;

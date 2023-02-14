import { readFile } from 'fs/promises'

/**
 * @type {import('./ADE-client').Room[] | undefined}
 */
let rooms = undefined
/**
 * @returns {Promise<import('./ADE-client').Room[]>}
 */
async function getRoomsFromFile() {
	let jsonStr = await readFile("./data/rooms.json")

	/**
	 * @type import('./ADE-client').Room[]
	 */
	let r = JSON.parse(jsonStr.toString())
	return r;

}

async function refreshRooms(){
	rooms = await getRoomsFromFile()
}

async function getRooms() {
	if (rooms === undefined)
		await refreshRooms()

	return rooms
}

export { getRooms, refreshRooms }
import type { CalendarResponse } from 'node-ical';
import type { ADEEvent } from '$lib/server/ADE-client/src/types';

type User = {
	id: number;
	login: string;
};

class PlanningOfDay {
	public events: ADEEvent[];
	constructor(events: ADEEvent[]) {
		this.events = events;
	}
}

type ADEUserAttributes = {
	prenom: string;
	mail: string;
	diplome: string;
	ecole: string;
	nom: string;
	profil: string;
};

type ADEUser = {
	user: string;
	attributes: ADEUserAttributes;
};

type Room = {
    id: number,
    name: string,
    isFolder: boolean,
    parent: number | null
};

export type { User, ADEUser, Room };
export { PlanningOfDay };

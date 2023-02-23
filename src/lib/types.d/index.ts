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
}

type ADEUser  = {
	user: string;
	attributes: ADEUserAttributes;
}

export type { User, ADEUser };
export { PlanningOfDay };

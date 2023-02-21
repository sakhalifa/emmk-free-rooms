import type { CalendarResponse } from 'node-ical';
import type { ADEEvent } from '$lib/server/ADE-client/src/types';

type User = {
	id: number;
	login: string;
};

class PlanningOfDay {
	/**
	 * All the events. They ARE NOT ORDERED!
	 */
	public events: ADEEvent[];
	constructor(events: ADEEvent[]) {
		this.events = events;
	}
}

export type { User };
export { PlanningOfDay };

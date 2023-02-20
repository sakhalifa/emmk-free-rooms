import type { CalendarResponse } from 'node-ical';

type PlanningEvent = {
	_id: string;
	location: string;
	summary: string;
	start: Date;
	end: Date;
};

type User = {
	id: number;
	login: string;
};

class PlanningOfDay {
	/**
	 * All the events. They ARE NOT ORDERED!
	 */
	public events: PlanningEvent[];
	constructor(events: CalendarResponse) {
		this.events = [];
		for (const ev of Object.values(events)) {
			if (ev.type === 'VEVENT') {
				this.events.unshift({
					_id: ev.uid,
					summary: ev.summary,
					location: ev.location,
					start: new Date(ev.start),
					end: new Date(ev.end)
				});
			}
		}
	}
}

export type { PlanningEvent, User };
export { PlanningOfDay };

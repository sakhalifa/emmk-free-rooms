import type { CalendarResponse } from "node-ical";


type ParamType = {
	/**The name of the paramter */
	name: string;
	/** Whether the parameter is required or not */
	required: boolean;
	/**A human-friendly type name */
	type: string;
	/**Min value (included) */
	min?: number;
	/**Max value (not included) */
	max?: number;
	/**Its allowed values. This is checked after min and max are checked */
	values?: unknown[];
	/**A parser function that converts a string/number into its correct type */
	_parser: (_: string) => unknown;
	/**Returns true iif the parameter has been correctly parsed */
	_checkFunction: (_: unknown) => boolean;
	/** */
};

type PlanningEvent = {
	summary: string;
	start: Date;
	end: Date;
}


class PlanningOfDay {
	/**
	 * All the events. They ARE NOT ORDERED!
	 */
	public events: PlanningEvent[]
	constructor(events: CalendarResponse){
		this.events = []
		for(const ev of Object.values(events)){
			if(ev.type === "VEVENT"){
				this.events.push({
					summary: ev.summary,
					start: new Date(ev.start),
					end: new Date(ev.end)
				})
			}

		}
	}
}

export type { ParamType, PlanningEvent};
export {PlanningOfDay}



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

export type { ParamType };

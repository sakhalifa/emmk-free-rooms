/**
 * Returns a new copy of `obj` without properties that start with an '_'
 * @param {any[]} obj 
 * @returns {any}
 */
function removePrivateParameters(obj) {
	return obj.map((o) => Object.fromEntries(Object.entries(o).filter(([key]) => !key.startsWith('_'))));
}

/**
 * 
 * @param {Date} timestamp 
 */
function convertDateToISODay(timestamp){
	return timestamp.toISOString().split('T')[0]
}

/**
 * A function that will check for errors in the url search parameters compared to a 
 * params array. Will return [true, errors] if an error occured, else [false, parsed_parameters]
 * where `parsed_parameters` is a dictionary with {params.name: params._parse(params.value)}
 * @param {{get: (key: string) => string | null}} searchParams Equivalent of a Map<string, string>
 * @param {import("./types.d").ParamType[]} params An array that says what and how searchParameters should
 * be processed
 * @return {[boolean, any]}
 */
function checkError(searchParams, params) {
	const paramRet = removePrivateParameters(params)
	/** @type any */
	let parsedParams = {}
	/**
	 * 
	 * @param {string} status 
	 * @param {string} errMsg 
	 * @returns 
	 */
	function error(status, errMsg) {
		return { status: status, error: errMsg, params: paramRet }
	}
	for (const param of params) {
		let p = searchParams.get(param.name);
		if (!p)
			if (param.required)
				return [
					true,
					error(
						"MISSING PARAMETER",
						`The param '${param.name}' was not found!`,
					)]
			else
				continue;
		/** @type any */
		let parsedParam = param._parser(p)
		if (!param._checkFunction(parsedParam))
			return [
				true,
				error(
					"INVALID PARAMETER",
					`Failed to parse the parameter '${param.name}'! Should be of type ${param.type}`,
				)]

		if (param.min !== undefined && parsedParam < param.min)
			return [
				true,
				error(
					"INVALID PARAMETER",
					`The parameter '${param.name}' is less than its min value (${param.min})!`
				)
			]

		if (param.max !== undefined && parsedParam >= param.max)
			return [
				true,
				error(
					"INVALID PARAMETER",
					`The parameter '${param.name}' is greater or equal than its max value (${param.max})!`
				)
			]

		if (param.values !== undefined && !param.values.includes(parsedParam)) {
			return [
				true,
				error(
					"INVALID PARAMETER",
					`The parameter '${param.name}' does not have a correct value!`
				)
			]
		}
		parsedParams[param.name] = parsedParam
	}
	return [false, parsedParams]
}

export { removePrivateParameters, checkError, convertDateToISODay };

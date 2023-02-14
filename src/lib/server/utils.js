/**
 * 
 * @param {any[]} obj 
 * @returns {any}
 */
function removePrivateParameters(obj) {
	return obj.map((o) => Object.fromEntries(Object.entries(o).filter(([key]) => !key.startsWith('_'))));
}

/**
 * 
 * @param {URL} url 
 * @param {import("./types.d").ParamType[]} params
 * @return {[boolean, any]}
 */
function checkError(url, params) {
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
		let p = url.searchParams.get(param.name);
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
	return [true, parsedParams]
}

export { removePrivateParameters, checkError };

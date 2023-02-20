/**
 * 
 * @param {Date} timestamp 
 */
function convertDateToISODay(timestamp) {
	return timestamp.toISOString().split('T')[0]
}

export {convertDateToISODay}
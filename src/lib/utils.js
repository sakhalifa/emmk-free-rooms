/**
 *
 * @param {Date} timestamp
 */
function convertDateToISODay(timestamp) {
	return timestamp.toISOString().split('T')[0];
}

/**
	 *
	 * @param {string | null} type
	 */
function getColorFromType(type) {
	switch (type) {
		case 'CM':
			return 'yellow';
		case 'CI':
			return 'lime';
		case 'TD':
			return 'cyan';
		case 'SCOLARITE':
		case 'ENSEIGNANTS':
			return 'red';
		case 'TP':
			return 'lightgray';
		default:
			return '';
	}
}

export { convertDateToISODay, getColorFromType };

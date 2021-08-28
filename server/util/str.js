/**
 * Capitalizes the first letter of the string
 * @param {String} str
 * @param {Boolean} lowerRest Indicates whether everything after the first letter of `str` should be transformed to lowercase.
 * @returns {String}
 */
function capitalize(str, lowerRest = false) {
	let rest = str.slice(1);
	if (lowerRest) rest = rest.toLowerCase();
	return str[0].toUpperCase() + rest;
}
module.exports.capitalize = capitalize;

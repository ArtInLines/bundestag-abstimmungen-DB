/** @param {[String]} voteEnum Array of of possible vote strings. The corresponding index indicates the enumerated number */
const voteEnum = ['ja', 'nein', 'Enthaltung', 'ungültig', 'nichtabgegeben'];
module.exports.voteEnum = voteEnum;

/**
 * Get the string connected to the vote enumerated number. Equivalent to `voteEnum[voteNum]`
 * @param {Number} voteNum Either a number or an instance of `voteModel`, with a number property of `vote`.
 * @returns {String}
 */
function getVoteStr(voteNum) {
	if (typeof voteNum !== 'number') voteNum = voteNum.vote;
	return voteEnum[voteNum];
}
module.exports.getVoteStr = getVoteStr;

/**
 * Returns the enumerated number of the vote `voteStr` or `undefined`
 * @param {String} voteStr
 * @returns {(Number | undefined)}
 */
function getVoteNum(voteStr) {
	voteStr = voteStr.toLowerCase();
	const i = voteEnum.findIndex((val) => val.toLowerCase() === voteStr);
	if (i >= 0) return voteEnum[i];
	return undefined;
}
module.exports.getVoteNum = getVoteNum;

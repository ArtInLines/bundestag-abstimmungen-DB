/**
 * Send an Error Message with a custom message and Status Code
 * @param {import("express").Response} res Response object
 * @param {String} msg Error Message to be displayed to the user
 * @param {Number} statusCode Error Status Code. Defaults to `400`
 */
function sendError(res, msg = 'Sorry, something went wrong...', statusCode = 400) {
	return res.status(statusCode).send({ success: false, err: msg });
}
module.exports.sendError = sendError;

/**
 * Send a data successfully with a Status Code
 * @param {import("express").Response} res Response object
 * @param {*} data Data to send to the frontend
 * @param {Number} statusCode Success Status Code. Defaults to `200`
 */
function sendSuccess(res, data, statusCode = 200) {
	return res.status(statusCode).send({ success: true, data });
}
module.exports.sendSuccess = sendSuccess;

const express = require('express');
const router = express.Router();
const Models = require('./../models/all');
const { sendError, sendSuccess } = require('./helper');
const { capitalize } = require('./../util/str');

/**
 * Gets the category from a request object or the category string itself and capitalizes the string
 * @param {(String | express.Request)} req String of Category or Request object, containing `.params.category`
 * @returns {String}
 */
const getCategory = (req) => capitalize(typeof req === 'string' ? req : req.params.category, true);
/**
 * Returns all parameters from a URL
 * @param {Object} params Request Parameter object
 */
const getURLParams = (params) => {
	if (params.hasOwnProperty('params') && params.params instanceof Object) params = params.params;
	if (params.hasOwnProperty('category')) params.category = getCategory(params.category);
	return params;
};

const defaultCB = (res, err, docs) => {
	if (err) sendError(res, err);
	else sendSuccess(res, docs);
};

router
	.get('/:category/:key=:val', async (req, res) => {
		const { category, key, val } = getURLParams(req.params);
		Models[category].model.find({ [key]: val }, (...args) => defaultCB(res, ...args));
	})
	.get('/:category/:id', async (req, res) => {
		const { category, id } = getURLParams(req.params);
		Models[category].model.findById(id, (...args) => defaultCB(res, ...args));
	})
	.post('/:category', async (req, res) => {
		const { category } = getURLParams(req.params);
		Models[category].model.create(req.body.data, {}, (...args) => defaultCB(res, ...args));
	});

module.exports = router;

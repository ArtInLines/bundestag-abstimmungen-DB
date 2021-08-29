const express = require('express');
const router = express.Router();
const Models = require('./../models/all');
const { sendError, sendSuccess } = require('./helper');
const { capitalize } = require('./../util/str');
const { Model } = require('mongoose'); // For documentation, might remove later

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

const defaultOpts = {};
const defaultUpdateOpts = { ...defaultOpts, ...{ new: true } };
const defaultDeleteOpts = { ...defaultOpts, ...{} };
const defaultCreateOpts = { ...defaultOpts, ...{} };

const noModelErrMsg = (category) =>
	`No Database Model for the category "${category}" could be found. This is probably because the category in the URL is wrong. Please make sure there are no spelling mistakes in the URL.`;

/**
 * Interact with the DB by calling `model[f](...Args)`.
 * @param {Object} o Parameter object
 * @param {express.Request} [o.req] Request object. Only needed if `data` and `model`/`category` aren't specified.
 * @param {express.Response} [o.res] Response object. Only needed if `cb` isn't specified.
 * @param {String} [o.key] Only needed if `filter` isn't specified. Defaults to `req.params.key || null`.
 * @param {*} [o.val] Only needed if `filter` isn't specified. Defaults to `req.params.val || null`.
 * @param {*} [o.filter] Defaults to `{ [key]: val }`.
 * @param {String} o.f Function name. Is used as `model[f](...args)`
 * @param {*} [o.data] Defaults to either `req.body.data` or `null`. If `!data`, data won't be added to the function call.
 * @param {Model} [o.model] Defaults to `getModel(category)`. If `!model && getModel(category) === undefined` the function will call `errCB(noModelErrMsg(category))` and return;
 * @param {?String} [o.category] Only needed if `!model` to set `model` to `getModel(category)`. Defaults to `model ? null : getCategory(req)`. If `!model && getModel(category) === undefined` the function will call `errCB(noModelErrMsg(category))` and return;
 * @param {?Object} [o.opts] Optional options to add to the DB interaction call. Defaults to `defaultOpts`.
 * @param {Array} [o.Args] List of Arguments to feed into the DB interaction. `Args = [...Args, ?filter, ?data, ?opts, ?cb]`, where `?var` means `var` only gets added if `var` is a non-empty value.
 * @param {?Function} [o.cb] Optional Callback to be called after the DB interaction returned. Defaults to `(...args) => defaultCB(res, ..args)`.
 * @param {Array} [o.cbArgs] Additional arguments to feed into `cb()`.
 * @param {Function} [o.errCb] Gets called for all errors, currently only when no `model` can be found. Defaults to `(msg) => sendError(res, msg)`. If `typeof errCB !== 'function'`, errCB will be set to a void function, to avoid unexpected behaviour.
 * @param {Array} [o.errCbArgs] Additional arguments to feed into `errCb()`.
 */
async function interactWithDB({
	req,
	res,
	key = req.params.key || null,
	val = req.params.val || null,
	filter = { [key]: val },
	f,
	data = req.body.data || null,
	model,
	category = model ? null : getCategory(req),
	opts = defaultOpts,
	Args = [],
	cb = (...args) => defaultCB(res, ...args),
	cbArgs = [],
	errCb = (msg) => sendError(res, msg),
	errCbArgs = [],
}) {
	if (typeof errCb !== 'function') errCb = () => null;
	if (!model) {
		model = getModel(category);
		if (model === undefined) return errCb(noModelErrMsg(category), ...errCbArgs);
	}

	if (filter) Args.push(filter);
	if (data) Args.push(data);
	if (opts) Args.push(opts);
	if (cb && typeof cb === 'function') Args.push((...args) => cb(...args, ...cbArgs));

	return model[f](...Args);
}

/** @returns {Model} */
const getModel = (category) => {
	if (Models.hasOwnProperty(category)) return Models[category].model;
	sendError(res, `Category "${category}" doesn't exist`, 400);
	return undefined;
};

const defaultCB = (res, err, docs) => {
	if (err) sendError(res, err);
	else sendSuccess(res, docs);
};

const cbEachModel = async ({ cb, args = [], errCb = null, errCbArgs = [] }) => {
	try {
		const keys = Object.keys(Models);
		const store = {};
		for (let i = 0; i < keys.length; i++) store[keys[i]] = await cb(Models[keys[i]], ...args);
		return store;
	} catch (err) {
		if (typeof errCb === 'function') return errCb(err, ...errCbArgs);
		throw err;
	}
};

router
	.get('/all', async (req, res) => {
		const result = await cbEachModel({ cb: (Model) => Model.model.find(), errCb: (err) => sendError(res, err.message) });
		sendSuccess(res, result);
	})
	.get('/schema', async (req, res) => {
		const result = await cbEachModel({ cb: (Model) => Model.schema });
		sendSuccess(res, result);
	})
	.get('/:category/schema', async (req, res) => {
		const obj = Models[req.params.category];
		if (!obj) sendError(res, noModelErrMsg(req.params.category));
		sendSuccess(res, obj.schema);
	})
	.get('/:category/all', async (req, res) => interactWithDB({ req, res, f: 'find', filter: {} }))
	.get('/:category/:key=:val', async (req, res) => interactWithDB({ req, res, f: 'findOne' }))
	.get('/category/:key=:val/all', async (req, res) => interactWithDB({ req, res, f: 'find' }))
	.get('/:category/:id', async (req, res) => interactWithDB({ req, res, f: 'find', filter: { _id: req.params.id } }))
	.post('/:category', async (req, res) => interactWithDB({ req, res, filter: null, f: 'create', opts: defaultCreateOpts }))
	.put('/:category/all', async (req, res) => interactWithDB({ req, res, f: 'updateMany', filter: {}, opts: defaultUpdateOpts }))
	.put('/:category/:key=:val', async (req, res) => interactWithDB({ req, res, f: 'updateOne', opts: defaultUpdateOpts }))
	.put('/:category/:key=:val/all', async (req, res) => interactWithDB({ req, res, f: 'updateMany', opts: defaultUpdateOpts }))
	.put('/:category/:id', async (req, res) => interactWithDB({ req, res, f: 'updateOne', filter: { _id: req.params.id }, opts: defaultUpdateOpts }))
	.delete('/:category/all', async (req, res) => interactWithDB({ req, res, filter: {}, f: 'deleteMany', opts: defaultDeleteOpts }))
	.delete('/:category/:id', async (req, res) => interactWithDB({ req, res, filter: { _id: req.params.id }, f: 'deleteOne', opts: defaultDeleteOpts }))
	.delete('/:category/:key=:val', async (req, res) => interactWithDB({ req, res, f: 'deleteMany', opts: defaultDeleteOpts }));

module.exports = router;

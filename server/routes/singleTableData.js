const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { sendError, sendSuccess } = require('./helper');

// Data for PUT or POST requests needs to be sent in the following format:
// { data: {
// 		cols: String[],
// 		vals: any[],
// 	}}
// Alternatively, data can also be sent like this:
// { data: [
// 		cols: String[],
// 		...vals: any[]
// 	]}

// PUT methods do not ever insert any new data into the DB.
// By default, POST methods use the REPLACE method,
// potentially overriding existing data in the DB instead of just inserting new data.
// To change this behaviour, add `"noReplacement" = true` to the request body.

router
	.route('/')
	.get((req, res, next) => {
		const db = getDB(res.locals.db);
		const rows = db.select(res.locals.table).all();
		sendSuccess(res, rows, 200);
	})
	.post((req, res, next) => {
		const db = getDB(res.locals.db);
		const data = req.body.data;
		let method = 'replace';
		if (req.body.noReplacement) method = 'insert';
		const result = db[method](res.locals.table, data.cols, ...data.vals);
		sendSuccess(res, result, 201);
	})
	.put((req, res, next) => {
		const db = getDB(res.locals.db);
		const result = db.update(res.locals.table, req.body.data);
		sendSuccess(res, result, 200);
	})
	.delete((req, res, next) => {
		const db = getDB(res.locals.db);
		const result = db.delete({ table: res.locals.table });
		sendSuccess(res, result, 200);
	});

router
	.route('/schema')
	.get((req, res, next) => {
		const db = getDB(res.locals.db);
		const result = db.schema(res.locals.table, false);
		sendSuccess(res, result, 200);
	})
	.put((req, res, next) => {
		// TODO: Add "alter table" method
	});

router.get('/schema/parsed', (req, res, next) => {
	const db = getDB(res.locals.db);
	const result = db.schema(res.locals.table, true);
	sendSuccess(res, result, 200);
});

router
	.route('/:key')
	.all((req, res, next) => {
		if (/^\[.*\]$/.test(req.params.key)) res.locals.key = JSON.parse(req.params.key);
		else res.locals.key = req.params.key;
	})
	.get((req, res, next) => {
		const db = getDB(res.locals.db);
		const result = db.select({ tableList: res.locals.table, columnList: res.locals.key }).all();
		sendSuccess(res, result, 200);
	});

module.exports = router;
//
//
/// OLD CODE
//
//

// router
// 	.get('/:db/:table/schema', (req, res) => {})
// 	.get('/all', async (req, res) => {
// 		cbEachModel({ cb: (Model) => Model.model.find() })
// 			.then((result) => sendSuccess(res, result))
// 			.catch((err) => sendError(res, err?.message));
// 	})
// 	.get('/:category/all', async (req, res) => interactWithDB({ req, res, f: 'find', filter: {} }))
// 	.get('/:category/:key=:val', async (req, res) => interactWithDB({ req, res, f: 'findOne' }))
// 	.get('/category/:key=:val/all', async (req, res) => interactWithDB({ req, res, f: 'find' }))
// 	.get('/:category/:id', async (req, res) => interactWithDB({ req, res, f: 'find', filter: { _id: req.params.id } }))

// 	.post('/:category', async (req, res) => interactWithDB({ req, res, filter: null, f: 'create', opts: defaultCreateOpts }))
// 	.post('/:category/add', async (req, res) => {
// 		const model = getModel(req.params.category);
// 		if (model === undefined) return sendError(res, noModelErrMsg(category));
// 		const doc = await model.findOne(req.body.filter);
// 		if (doc === null) model.create(req.body.data, (...args) => defaultCB(res, ...args));
// 		else model.updateOne(req.body.filter, addToDoc(doc, req.body.data), (...args) => defaultCB(res, ...args));
// 	})
// 	.post('/:category/add/all', async (req, res) => {
// 		const model = getModel();
// 	})

// 	.put('/:category/all', async (req, res) => interactWithDB({ req, res, f: 'updateMany', filter: {}, opts: defaultUpdateOpts }))
// 	.put('/:category/:key=:val', async (req, res) => interactWithDB({ req, res, f: 'updateOne', opts: defaultUpdateOpts }))
// 	.put('/:category/:key=:val/all', async (req, res) => interactWithDB({ req, res, f: 'updateMany', opts: defaultUpdateOpts }))
// 	.put('/:category/:id', async (req, res) => interactWithDB({ req, res, f: 'updateOne', filter: { _id: req.params.id }, opts: defaultUpdateOpts }))

// 	.delete('/all', async (req, res) => {
// 		cbEachModel({ cb: (Model) => Model.model.deleteMany() })
// 			.then((result) => sendSuccess(res, result))
// 			.catch((err) => sendError(res, err?.message));
// 	})
// 	.delete('/:category/all', async (req, res) => interactWithDB({ req, res, filter: {}, f: 'deleteMany', opts: defaultDeleteOpts }))
// 	.delete('/:category/:id', async (req, res) => interactWithDB({ req, res, filter: { _id: req.params.id }, f: 'deleteOne', opts: defaultDeleteOpts }))
// 	.delete('/:category/:key=:val', async (req, res) => interactWithDB({ req, res, f: 'deleteMany', opts: defaultDeleteOpts }));

// module.exports = router;

// /**
//  * Interact with the DB by calling `model[f](...Args)`.
//  * @param {Object} o Parameter object
//  * @param {express.Request} [o.req] Request object. Only needed if `data` and `model`/`category` aren't specified.
//  * @param {express.Response} [o.res] Response object. Only needed if `cb` isn't specified.
//  * @param {String} [o.key] Only needed if `filter` isn't specified. Defaults to `req.params.key || null`.
//  * @param {*} [o.val] Only needed if `filter` isn't specified. Defaults to `req.params.val || null`.
//  * @param {*} [o.filter] Defaults to `{ [key]: val }`.
//  * @param {String} o.f Function name. Is used as `model[f](...args)`
//  * @param {*} [o.data] Defaults to either `req.body.data` or `null`. If `!data`, data won't be added to the function call.
//  * @param {Model} [o.model] Defaults to `getModel(category)`. If `!model && getModel(category) === undefined` the function will call `errCB(noModelErrMsg(category))` and return;
//  * @param {?String} [o.category] Only needed if `!model` to set `model` to `getModel(category)`. Defaults to `model ? null : getCategory(req)`. If `!model && getModel(category) === undefined` the function will call `errCB(noModelErrMsg(category))` and return;
//  * @param {?Object} [o.opts] Optional options to add to the DB interaction call. Defaults to `defaultOpts`.
//  * @param {Array} [o.Args] List of Arguments to feed into the DB interaction. `Args = [...Args, ?filter, ?data, ?opts, ?cb]`, where `?var` means `var` only gets added if `var` is a non-empty value.
//  * @param {?Function} [o.cb] Optional Callback to be called after the DB interaction returned. Defaults to `(...args) => defaultCB(res, ..args)`.
//  * @param {Array} [o.cbArgs] Additional arguments to feed into `cb()`.
//  * @param {Function} [o.errCb] Gets called for all errors, currently only when no `model` can be found. Defaults to `(msg) => sendError(res, msg)`. If `typeof errCB !== 'function'`, errCB will be set to a void function, to avoid unexpected behaviour.
//  * @param {Array} [o.errCbArgs] Additional arguments to feed into `errCb()`.
//  */
// async function interactWithDB({
// 	req,
// 	res,
// 	key = req.params.key || null,
// 	val = req.params.val || null,
// 	filter = { [key]: val },
// 	f,
// 	data = req.body.data || null,
// 	model,
// 	category = model ? null : getCategory(req),
// 	opts = defaultOpts,
// 	Args = [],
// 	cb = (...args) => defaultCB(res, ...args),
// 	cbArgs = [],
// 	errCb = (msg) => sendError(res, msg),
// 	errCbArgs = [],
// }) {
// 	if (typeof errCb !== 'function') errCb = () => null;
// 	if (!model) {
// 		model = getModel(category);
// 		if (model === undefined) return errCb(noModelErrMsg(category), ...errCbArgs);
// 	}

// 	if (filter) Args.push(filter);
// 	if (data) Args.push(data);
// 	if (opts) Args.push(opts);
// 	if (cb && typeof cb === 'function') Args.push((...args) => cb(...args, ...cbArgs));

// 	return model[f](...Args);
// }

// const addToArr = (arr, ...toAdd) => {
// 	const set = new Set([...arr, ...toAdd]);
// 	return Array.from(set.values());
// };

// const addToObj = (obj, toAddObj) => {
// 	const toAddKeys = Object.keys(toAddObj);
// 	toAddKeys.forEach((key) => (obj[key] = toAddObj[key]));
// 	return obj;
// };

// const addToDoc = (doc, toAdd) => {
// 	const keys = Object.keys(doc);
// 	for (let i = 0; i < keys.length; i++) {
// 		const key = keys[i];
// 		if (!toAdd.hasOwnProperty(key)) continue;
// 		if (Array.isArray(doc[key])) doc[key] = addToArr(doc[key], ...toAdd[key]);
// 		else if (doc[key] instanceof Object) doc[key] = addToObj(doc[key], toAdd[key]);
// 		else doc[key] = toAdd[key];
// 	}
// 	return doc;
// };

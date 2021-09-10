const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const singleTableRouter = require('./singleTableData');

const dbPaths = ['/:db', '/:db/:table'];

// TODO: Add authorization middle for PUT, POST & DELETE methods

// Middleware
router.use(dbPaths, (req, res, next) => {
	res.locals.db = req.params.db;
	res.locals.table = req.params?.table;
	if (getDB(res.locals.db) === undefined) {
		res.status(404);
		next(new Error(`No Database with the name "${req.params.db}" could be found.`));
	}
	next();
});

router.post(dbPaths, (req, res, next) => {
	if (Array.isArray(req.body)) req.body.data = { cols: req.body.shift(), vals: req.body };
	else if (!req.body?.data?.cols || !req.body?.data?.vals) {
		res.status(404);
		next(
			new Error(
				`The emitted data is not in an accepted format. Make sure that the emitted data is in JSON format with the 'data' property either being an array or an Object., where the 'cols' property / first element of the Array is a List of column names in the table and the property 'vals' / the further array elements are a List of elements corresponding to the column names of the same index`
			)
		);
	}
	next();
});

router.put(dbPaths, (req, res, next) => {
	if (!Array.isArray(req.body?.data)) {
		if (typeof req.body?.data === 'object') req.body.data = Object.entries(req.body.data);
		else {
			res.status(404);
			next(
				new Error(
					`The emitted data is not in an accepted format. Make sure that the emitted data is in JSON format with the 'data' property either being a 2D-Array mapping each column name to some value or an Object`
				)
			);
		}
	}
	next();
});

// Add route handlers
// TODO: Add singleDBRouter
// router.use('/:db', singleDBDataRouter)
router.use('/:db/:table', singleTableRouter);

module.exports = router;

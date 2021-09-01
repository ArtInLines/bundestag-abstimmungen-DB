const express = require('express');
const router = express.Router();
const DataBases = require('../db');
const singleTableRouter = require('./singleTableData');

const noDBErrMsg = (db) => `No Database with the name "${db}" could be found.`;

// Store URL parameters
// and check for errors
router.use(['/:db', '/:db/:table'], (req, res, next) => {
	res.locals.db = DataBases?.[req.params.db];
	res.locals.table = req.params?.table;
	if (res.locals.db === undefined) {
		res.status(404);
		next(new Error(noDBErrMsg(req.params.db)));
	}
	next();
});

// TODO: Add singleDBRouter
// router.use('/:db', singleDBDataRouter)

router.use('/:db/:table', singleTableRouter);

module.exports = router;

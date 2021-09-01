const express = require('express');

// TODO: Add actual Error Handling

function defaultErrHandler(err, req, res, next) {
	next(err);
}

module.exports = [defaultErrHandler];

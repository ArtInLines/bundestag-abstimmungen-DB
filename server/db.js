const Database = require('sqlite3-js');
const path = require('path');
const fs = require('fs');

function getDBPath(name, dir = path.resolve(__dirname, 'db')) {
	const nameExt = path.extname(name);
	if (nameExt !== '.db' && nameExt !== '.dat' && nameExt !== '.sqlite') name += '.db';
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	return path.resolve(dir, name);
}

const DB_OPTS = {};

/**
 * @typedef {Object.<String, SQLiteDB>} DataBases
 */
const DataBases = {};

// For Testing
// console.log(DataBases['uk']);

/**
 * Get the specified DB to run queries on it.
 * @param {String} key Name of the DB. Should be the two-letter code of a country (e.g. 'de' for germany, 'uk' for the UK, etc.)
 * @returns {(SQLiteDB | undefined)} Returns a Database instance or `undefined` if no database with the name `key` could be found.
 */
function getDB(key) {
	return DataBases[key];
}

module.exports.getDB = getDB;

/**
 *
 * @param  {...String} dbNames Names of DB
 */
module.exports.init = (...dbNames) => {
	if (dbNames.values === 1 && Array.isArray(dbNames)) dbNames = dbNames[0];
	dbNames.forEach((str) => (DataBases[str] = new Database(getDBPath(str), DB_OPTS)));
	return DataBases;
};

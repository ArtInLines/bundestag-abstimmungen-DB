const Database = require('sqlite3-js');
const path = require('path');
const SQLiteDB = require('sqlite3-js/docs/lib/SQLiteDB');

function getDBPath(name) {
	const nameExt = path.extname(name);
	if (nameExt !== '.db' && nameExt !== '.dat' && nameExt !== '.sqlite') name += '.db';
	return path.resolve(__dirname, 'db', name);
}

const DB_OPTS = {};

/**
 * @typedef {Object.<String, SQLiteDB>} DataBases
 */
const DataBases = {};
['de', 'uk', 'us'].forEach((str) => (DataBases[str] = new Database(getDBPath(str), DB_OPTS)));

// For Testing
console.log(DataBases['uk']);

/**
 * Get the specified DB to run queries on it.
 * @param {String} key Name of the DB. Should be the two-letter code of a country (e.g. 'de' for germany, 'uk' for the UK, etc.)
 * @returns {(SQLiteDB | undefined)} Returns a Database instance or `undefined` if no database with the name `key` could be found.
 */
function getDB(key) {
	return DataBases[key];
}

module.exports.getDB = getDB;

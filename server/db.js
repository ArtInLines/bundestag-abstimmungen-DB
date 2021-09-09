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
const DataBases = {
	de: new Database('de', DB_OPTS),
};

['de', 'uk', 'us'].forEach((str) => (DataBases[str] = new Database(getDBPath(str), DB_OPTS)));

// For Testing
console.log('Foreign Keys in DB "de":', DataBases['uk']);

module.exports = DataBases;

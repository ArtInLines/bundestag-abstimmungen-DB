const Database = require('better-sqlite3');
const path = require('path');

function getDBPath(name) {
	const nameExt = path.extname(name);
	if (nameExt !== '.db' && nameExt !== '.dat' && nameExt !== '.sqlite') name += '.db';
	return path.resolve(__dirname, 'db', name);
}

/**
 * @typedef {Object<String, Database>} DataBases
 */
const DataBases = {};

['de', 'uk', 'us'].forEach((str) => (DataBases[str] = new Database(getDBPath(str))));

// For Testing
console.log('Foreign Keys in DB "de":', DataBases['de'].pragma('foreign_keys', { simple: true }));

module.exports = DataBases;

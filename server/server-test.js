const Database = require('better-sqlite3');
const start = Date.now();
const db = new Database('test.db', { verbose: console.log });

const middleBegin = Date.now();
const arr = new Array(10000).fill(0).map((val, i) => Math.round(Math.random() * i));
db.prepare('CREATE TABLE IF NOT EXISTS cats (name TEXT NOT NULL, age INTEGER)').run();
const insertCats = (name, age) => db.prepare('INSERT INTO cats (name, age) VALUES (?, ?)').run(name, age);
[
	['Johann', 3],
	['Xavier', 8],
	['Sissy', 1],
].forEach((arr) => insertCats(...arr));
const middleEnd = Date.now();

db.close();
const end = Date.now();

console.log({ startMiddle: middleBegin - start, middle: middleEnd - middleBegin, startEnd: end - start });

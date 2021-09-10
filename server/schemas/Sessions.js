const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const Session = new mongoose.Schema({
	legislatureNr: Number,
	meetingNr: Number,
	votingNr: Number,
	votes: [ObjectID],
	people: [ObjectID],
});
module.exports.schemaObj = Session.obj;

module.exports.model = mongoose.model('sessionModel', Session);

/** @type {import("sqlite3-js/docs/lib/methods/createTable").createTableOpts} */
const sessionsSchema = {
	name: 'Sessions',
	cols: [
		{
			name: 'session_id',
			type: 'INTEGER',
			notNull: true,
			autoincrement: true,
			primaryKey: true,
		},
		{
			name: 'legislatureNr',
			type: 'REAL',
		},
		{
			name: 'meetingNr',
			type: 'REAL',
		},
		{
			name: 'votingNr',
			type: 'REAL',
		},
		{
			name: 'date',
			type: 'TEXT',
		},
	],
	ifNotExists: true,
	withoutRowID: true,
};

module.exports = sessionsSchema;

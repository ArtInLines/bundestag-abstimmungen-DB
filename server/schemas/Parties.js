/** @type {import("sqlite3-js/docs/lib/methods/createTable").createTableOpts} */
const partySchema = {
	name: 'party',
	cols: [
		{
			name: 'party_id',
			type: 'INTEGER',
			notNull: true,
			autoincrement: true,
			primaryKey: true,
		},
		{
			name: 'name',
			type: 'TEXT',
			unique: true,
		},
		// TODO: Add further data about the parties maybe
	],
	ifNotExists: true,
	withoutRowID: true,
};

module.exports = partySchema;

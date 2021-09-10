/** @type {import("sqlite3-js/docs/lib/methods/createTable").createTableOpts} */
const MoPsSchema = {
	name: 'MoPs',
	cols: [
		{
			name: 'MoP_id',
			type: 'INTEGER',
			notNull: true,
			autoincrement: true,
			primaryKey: true,
		},
		{
			name: 'firstname',
			type: 'TEXT',
		},
		{
			name: 'lastname',
			type: 'TEXT',
		},
		{
			name: 'fullname',
			type: 'TEXT',
			notNull: true,
		},
		/* {
			name: 'title',
			type: 'TEXT',
		}, */
	],
	ifNotExists: true,
	withoutRowID: true,
};

module.exports = MoPsSchema;

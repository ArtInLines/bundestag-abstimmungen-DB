/** @type {import("sqlite3-js/docs/lib/methods/createTable").createTableOpts} */
const votesSchema = {
	name: 'Votes',
	cols: [
		{
			name: 'vote_id',
			type: 'INTEGER',
			notNull: true,
			autoincrement: true,
			primaryKey: true,
		},
		{
			name: 'vote',
			type: 'INTEGER',
			check: 'vote <= 4 AND vote >= 0', // Between 0-4
		},
		{
			name: 'MoP_id',
			type: 'INTEGER',
			notNull: true,
			foreignKey: {
				foreignTable: 'MoPs',
				foreignKey: 'MoP_id',
			},
		},
		{
			name: 'party_id',
			type: 'INTEGER',
			notNull: true,
			foreignKey: {
				foreignTable: 'Parties',
				foreignKey: 'party_id',
			},
		},
		{
			name: 'session_id',
			type: 'INTEGER',
			notNull: true,
			foreignKey: {
				foreignTable: 'Sessions',
				foreignKey: 'session_id',
			},
		},
	],
	ifNotExists: true,
	withoutRowID: true,
	onUpdateDefaultAction: 'CASCADE',
	onDeleteDefaultAction: 'CASCADE',
};

module.exports = votesSchema;

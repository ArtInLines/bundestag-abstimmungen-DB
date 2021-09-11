/** @type {import("sqlite3-js/docs/lib/methods/createTable").createTableOpts} */
const sessionsVotesGroupSchema = {
	name: 'sessions_votes_group',
	cols: [
		{
			name: 'session_id',
			type: 'INTEGER',
			notNull: true,
			primaryKey: true,
			foreignKey: {
				foreignKey: 'session_id',
				foreignTable: 'sessions',
			},
		},
		{
			name: 'vote_id',
			type: 'INTEGER',
			notNull: true,
			primaryKey: true,
			foreignKey: {
				foreignKey: 'vote_id',
				foreignTable: 'votes',
			},
		},
	],
	ifNotExists: true,
	withoutRowID: true,
	onUpdateDefaultAction: 'CASCADE',
	onDeleteDefaultAction: 'CASCADE',
};

module.exports = sessionsVotesGroupSchema;

/** @type {import("sqlite3-js/docs/lib/methods/createTable").createTableOpts} */
const sessionsVotesGroupSchema = {
	name: 'parties_MoPs_group',
	cols: [
		{
			name: 'party_id',
			type: 'INTEGER',
			notNull: true,
			primaryKey: true,
			foreignKey: {
				foreignKey: 'party_id',
				foreignTable: 'parties',
			},
		},
		{
			name: 'MoP_id',
			type: 'INTEGER',
			notNull: true,
			primaryKey: true,
			foreignKey: {
				foreignKey: 'MoP_id',
				foreignTable: 'MoPs',
			},
		},
	],
	ifNotExists: true,
	withoutRowID: true,
	onUpdateDefaultAction: 'CASCADE',
	onDeleteDefaultAction: 'CASCADE',
};

module.exports = sessionsVotesGroupSchema;

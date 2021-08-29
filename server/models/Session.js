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

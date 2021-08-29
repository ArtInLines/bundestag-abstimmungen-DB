const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const Party = new mongoose.Schema({
	name: { type: String },
	people: [ObjectID],
	votes: [ObjectID],
});
module.exports.schema = Party;

module.exports.model = mongoose.model('partyModel', Party);

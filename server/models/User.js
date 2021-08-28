const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const Person = new mongoose.Schema({
	firstname: String,
	lastname: String,
	title: String,
	fullname: String,
	votes: [ObjectID],
	parties: [ObjectID],
});

module.exports.model = mongoose.model('personModel', Person);

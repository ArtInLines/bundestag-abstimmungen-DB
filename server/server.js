require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
// Routing
app.use('/api/v1', require('./routes/data'));

// Start up server & connect to DB
app.listen(process.env.PORT, async () => {
	console.log(`Server listening on port ${process.env.PORT}`);

	// Connect to DB
	const DB_URI = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster.kkmix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
	const conn = await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
	console.log(`Connected to MongoDB on host ${conn.connection.host}`);
});

/* process.on('unhandledRejection', (err) => {
	console.log('Unhandled Error Rejection:', { err });
	process.exit(1);
}); */
mongoose.connection.on('error', (err) => {
	console.error('Database connection Error', { err });
	process.exit(1);
});

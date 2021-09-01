require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Routing & Middleware
app.use(express.json());
app.use('/static', express.static(path.resolve(__dirname, 'public/')));
app.use('/static', express.static(path.resolve(__dirname, 'files/')));
app.use('/api/v1', require('./routes/backend'));
app.use(...require('./middleware/errHandler'));

// Start up server & connect to DB
app.listen(process.env.PORT, async () => {
	console.log(`Server listening on port ${process.env.PORT}`);

	/* // Connect to DB
	const DB_URI = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster.kkmix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
	const conn = await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
	console.log(`Connected to MongoDB on host ${conn.connection.host}`); */
});

/* process.on('unhandledRejection', (err) => {
	console.log('Unhandled Error Rejection:', { err });
	process.exit(1);
}); */

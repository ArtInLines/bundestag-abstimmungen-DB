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

// Set up DB
require('./db').init(...process.env.DATABASES.split(','));

// Start up server & connect to DB
app.listen(process.env.PORT, async () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});

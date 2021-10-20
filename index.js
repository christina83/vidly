const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
    .then( () => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

// Middleware Functions
app.use(express.json());
app.use('/api/genres', genres); // for every URL like this, use the genres router
app.use('/api/customers', customers); // for every URL like this, use the customers router
 
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));


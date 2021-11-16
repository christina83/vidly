// Separation of concerns in einzelnen Files unter startup/...
// Single responsibility principle

const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')(); // First, to log an error when loading of other modules fails
require('./startup/routes')(app); // We get a function with parameter app
require('./startup/db')(); // We get a function, so let's call it
require('./startup/config')();
require('./startup/validation')();
 
const port = process.env.PORT || 3000
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;


// TODO:
// Fails in Terminal auflösen
// Diagramme validate(validateReturn)
// validate Refactoring in allen Routern
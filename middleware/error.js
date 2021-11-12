// Details of error handling should be encapsulated in this separate module
// This function works only inside of Express
const winston = require('winston');

module.exports = function(err, req, res, next) {
    winston.error(err.message, err);    
    res.status(500).send('Something failed');  // 500: Something failed on the server, we don't know what
}
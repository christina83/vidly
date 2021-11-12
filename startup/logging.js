const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');


module.exports = function() {
    // Dies braucht man, weil "error.js" nur innerhalb von Express wirkt (behandelt aber nur uncaught exceptions, keine promise rejections)
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    )

    // Subscribe to "unhandledRejection" Event
    // Weil Winston nur uncaught Exceptions behandelt, wandeln wir hier die Rejection zu einer Exception um und geben diese an Winston
    // Winston wird hier automatisch die Exception zu "handleExceptions" weitergeben und den Prozess danach beenden
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Define the transport goal of the error message
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    /* winston.add(winston.transports.MongoDB, { 
        db: 'mongodb://localhost/vidly',
        level: 'info'
    }); */
}
const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db)
        .then( () => winston.info(`Connected to ${db}...`));
    // Wenn Connection nicht klappt, wird ein Error ausgegeben und geloggt
}
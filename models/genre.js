const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');

// Create schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

// Create model
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(genre, schema);
};

exports.genreSchema = genreSchema;
exports.validate = validateGenre;
exports.Genre = Genre;
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('Joi');

// Create schema
const userSchema = new mongoose.Schema ({
    name: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    // joi-password-complexity kann ich verwenden, um die Vorgaben für das Passwort festzulegen
    password: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024 // in MongoDB wird das gehashte Passwort gespeichert, da werden aus 255 chars schnell 1024 chars
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {  // here we cannot replace the function keyword with the arrow syntax (don't use in functions that are part of an object)
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); // "this" in an arrow function references the function
    return token;
}

// Create model
const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validateUser;



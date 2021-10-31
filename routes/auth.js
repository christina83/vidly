// Build an endpoint to manage the authentication
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Einen neuen User registrieren (Log out passiert beim Client durch Delete des Token beim Client)
router.post('/', async (req, res) => {
    const { error } = validate(req.body); // mit Joi wird der Input des Users validiert 
    if (error) return res.status(400).send(error.details[0].message); // wenn es strukturell falsch war, Error

    let user = await User.findOne({ email: req.body.email }); // prüfen, ob in MongoDB ein User mit dieser Email existiert
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password) // plain password + salt gets compared with hashed password
    if (!validPassword) return res.status(400).send('Invalid email or password');


    // Generating Authentication Tokens
    // Mit jwt kann ich einen Payload (hier _id) abfragen, ohne einen Request machen zu müssen (brauche dafür einen private key)
    // Generating tokens should be encapsulated in the user for non-repetitive code
    const token = user.generateAuthToken();
    res.send(token);
});


// Für die Authentication brauchen wir ja nur Email und Passwort prüfen
function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
};


module.exports = router;

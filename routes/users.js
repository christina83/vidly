// Build an endpoint to manage the users
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Wenn auth fehlschlägt, kommt man nie bis zu async
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');  // Die ID nicht aus URL, sondern aus Webtoken entnehmen, sicherer
    res.send(user);
});

// Einen neuen User registrieren
router.post('/', async (req, res) => {
    const { error } = validate(req.body); // mit Joi wird der Input des Users validiert 
    if (error) return res.status(400).send(error.details[0].message); // wenn es strukturell falsch war, Error

    let user = await User.findOne({ email: req.body.email }); // prüfen, ob in MongoDB schon ein User mit dieser Email existiert
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); // Das Passwort ist ab jetzt als Hash gespeichert
    await user.save(); // await heißt: Wir machen erst weiter, wenn es gespeichert wurde. user ist eine "user-Instanz"

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); // Das Passwort soll nicht zurückgegeben werden, weil geheim
});


module.exports = router;

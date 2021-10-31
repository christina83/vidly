// Build an endpoint to manage the genres
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get overview of genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Post a new genres into the database (only by authenticated users)
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({ name: req.body.name });
    await genre.save(); // await heißt: Wir machen erst weiter, wenn es gespeichert wurde. genre ist eine "genre-Instanz"
    // await (new Genre({ name: 'Christina'})).save(); // Was macht "new"
    res.send(genre);
});

// Update an already existing genre
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);    
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new: true
    });
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

// Delete a genre
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

// Get a single genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
})

module.exports = router;

// POST nach /api/rentals
// Get the list of rentals
// GET /api/rentals
// Build an endpoint to manage the rentals

const {Rental, validate} = require('../models/rental');
const{Movie: Rental} = require('../models/movie');
const{Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Get the list of rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

// Post a new rental into the database
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({ 
        customer: {
            _id: customer._id,  // damit ich die ID habe, um später ggf. noch mehr Infos über diesen Customer zu holen
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: moviel.dailyRentalRate
        }
    });
    rental = await rental.save();
    movie.numberInStock--;
    movie.save();
    res.send(rental);
});

// Get a single movie
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found');
    res.send(rental);
});

module.exports = router;

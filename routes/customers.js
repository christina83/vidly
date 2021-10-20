// Build an endpoint to manage the customers
const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get overview of customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// Post a new customer into the database
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    customer = await customer.save();
    res.send(customer);
});

// Update an already existing customer
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);    
    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name, 
            phone: req.body.phone, 
            isGold: req.body.isGold
        }, {new: true});
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
});

// Get a single customer
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
})

module.exports = router;
const Joi = require('Joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
    { id: 1, name: 'romance' },
    { id: 2, name: 'humor' },
    { id: 3, name: 'drama' },
    { id: 4, name: 'action' },
];

app.get('/', (req, res) => {
    res.send('This is vidly, your video library');
});

app.get('/genres', (req, res) => {
    res.send(genres);
});

app.get('/genres/:id', (req, res) => {
    // Look up the genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    // Send the genre to the client
    res.send(genre);
})

app.post('/genres', (req, res) => {
    // Validation of the genre
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);

    // Creation of a new genre
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };

    // Push the genre to already existing ones
    genres.push(genre);
    res.send(genre);
});

app.put('/genres/:id', (req, res) => {
    // Look up the genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');
    
    // Validate the genre
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the genre
    genre.name = req.body.name;
    res.send(genre);
});

app.delete('/genres/:id', (req, res) => {
    // Look up the genre
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    // Delete the genre
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Return the deleted genre
    res.send(genre);
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
};

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Listening on port ${port}...'));


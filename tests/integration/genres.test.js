// All integration tests for the genres endpoint go into this file
const request = require('supertest');
const {Genre} = require('../../models/genre'); // Object destructuring, weil genre.js sowohl die Klasse Genre, als auch die Funktion validate exportiert
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach( async () => { 
        server = require('../../index');
        await Genre.remove( {} ); 
    });
    afterEach( () => { 
        server.close();
    });

    // Test Suite 1
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);
            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2); 
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy(); // some() checks for the existence of an object within the array
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    // Test Suite 2
    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async() => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async() => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id exists', async() => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });
    });

    // Test Suite 3
    describe('POST /', () => {

        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the test

        let token;
        let name;

        const exec = async () => {
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }

        beforeEach( () => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {  
            name = '1234';      

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid ', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre1' });
            
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid ', async () => {

            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    // Test Suite 4
    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;
        
        const exec = async() => {
            return await request(server)
                .put('/api/genres/' + id)   // send the PUT request
                .set('x-auth-token', token) // send the token to authenticate me
                .send({ name: newName });   // send the new genre name
        }

        beforeEach( async() => {
            genre = new Genre({ name: 'genre1' });  // I create the 'genre1' genre
            await genre.save();                     // I try to save that genre in the database

            token= new User().generateAuthToken();  // I create a token for a new user
            id = genre._id;                         // I save the id from the created genre into a variable
            newName = 'updatedName';                // I set the new genre name
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234'; // I create a Genre name with less than 5 characters

            const res = await exec(); // I send a PUT request to the server with my token and the new Genre name

            expect(res.status).toBe(400); // I proof if the response is as expected
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a'); // I create a Genre name with more than 50 characters

            const res = await exec(); // I send a PUT request to the server with my token and the new Genre name

            expect(res.status).toBe(400); // I proof if the response is as expected
        });

        it('should return 404 if id is invalid', async () => {
            id = 1; // Set an invalid id

            const res = await exec(); // I send a PUT request for a genre with that id

            // FEHLER
            expect(res.status).toBe(404); // I proof if the response says that this id cannot be found
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = mongoose.Types.ObjectId(); // create an id with mongoose

            const res = await exec(); // I send a PUT request for a genre with that id

            expect(res.status).toBe(404); // I proof if the response says that this id cannot be found
        });

        // Happy path
        it('should update the genre if input is valid', async () => {
            await exec(); // I send a PUT request for a genre

            const updatedGenre = await Genre.findById(genre._id); // I create a variable with content of genre object

            expect(updatedGenre.name).toBe(newName); // I compare the genre name to test object in this class
        });

        // Happy path
        it('should return the updated genre if it is valid', async () => {
            const res = await exec();  // I send a PUT request for a genre with that id and save the response

            expect(res.body).toHaveProperty('_id'); // I proof if the response contains the id of our test genre
            expect(res.body).toHaveProperty('name', newName);
        });
    });

    /* // Test Suite 5
    describe('DELETE /', () => {

    }); */
});
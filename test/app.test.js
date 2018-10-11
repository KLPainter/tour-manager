require('dotenv').config();
require('../lib/mongoose-connector')();
const mongoose = require('mongoose');
const Tour = require('../lib/models/Tour');
const request = require('supertest');
const app = require('../lib/app');

describe('tour API', () => {

    let sampleStop = {
        location: {
            city: 'Portland',
            state: 'OR',
            zip: '97229'
        },
        weather: {
            temperature: '45 F',
            condition: 'Rainy',
            windSpeed: '5 mph'
        },
        attendance: 200
    };

    let seedTours = [
        { title: 'Tour Stop 1', activities: ['trapeze', 'pie eating'], launchDate: new Date('January 1, 2001'), stops: [sampleStop, sampleStop] },
        { title: 'Tour Stop 2', activities: ['parade', 'clowns'], launchDate: new Date('February 1, 2002'), stops: [sampleStop, sampleStop] },
        { title: 'Tour Stop 3', activities: ['tightrope', 'slack line'], launchDate: new Date('March 1, 2003'), stops: [sampleStop, sampleStop] }
    ];

    let createdTours;

    const makeTour = tour => {
        return request(app)
            .post('/tours')
            .send(tour)
            .then(res => res.body);
    };

    beforeEach(() => {
        return Tour.deleteMany();
    });

    beforeEach(() => {
        return Promise.all(seedTours.map(makeTour)).then(toursRes => {
            createdTours = toursRes;
        });
    });

    afterAll(() => {
        return mongoose.disconnect();
    });

    it('creates a game on post', () => {
        const newTour =  { title: 'Tour Stop 4', activities: ['darts', 'cat herding'], launchDate: new Date('April 1, 2004'), stops: [sampleStop, sampleStop] };
        return request(app)
            .post('/tours')
            .send(newTour)
            .then(res => {
                expect(res.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String),
                    ...newTour
                });
            });
    });

});

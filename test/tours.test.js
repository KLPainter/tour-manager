const request = require('supertest');
const app = require('../lib/app');
const { dropCollection } = require('./db');

describe('tour API', () => {

    let seedTours = [
        { title: 'Tour Stop 1', activities: ['trapeze', 'pie eating'], launchDate: '2011-01-01T07:00:00.000Z' },
        { title: 'Tour Stop 2', activities: ['parade', 'clowns'], launchDate: '2012-02-02T07:00:00.000Z' },
        { title: 'Tour Stop 3', activities: ['tightrope', 'slack line'], launchDate: '2013-03-03T07:00:00.000Z' }
    ];

    let createdTours;

    const makeTour = tour => {
        return request(app)
            .post('/tours')
            .send(tour)
            .then(res => res.body);
    };

    beforeEach(() => {
        dropCollection('tours');
    });

    beforeEach(() => {
        return Promise.all(seedTours.map(makeTour)).then(toursRes => {
            createdTours = toursRes;
        });
    });

    afterAll(() => {
        return mongoose.disconnect();
    });

    it('creates a tour on post', () => {
        const newTour =  { 
            title: 'Tour Stop 4', 
            activities: ['darts', 'cat herding'], 
            launchDate: '2014-04-04T07:00:00.000Z',
            stops: []
        };
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

    it('gets all tours', () => {
        return request(app)
            .get('/tours')
            .then(retrievedTours => {
                createdTours.forEach(createdTour => {
                    expect(retrievedTours.body).toContainEqual(createdTour);
                });
            });
    });

});

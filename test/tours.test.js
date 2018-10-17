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

    it('get a tour by id', () => {
        const id = createdTours[1]._id;
        return request(app)
            .get(`/tours/${id}`)
            .then(result => {
                expect(result.body).toEqual(createdTours[1]);
            });
    });

    it('posts a stop to a tour', () => {
        const id = createdTours[1]._id;
        const stop = { zip: '97229', attendance: 250 };
        return request(app)
            .post(`/tours/${id}/stops`)
            .send(stop)
            .then(result => {
                expect(result.body).toEqual({
                    ...createdTours[1],
                    stops: [
                        {   
                            _id: expect.any(String),
                            location: {
                                city: expect.any(String),
                                state: expect.any(String),
                                zip: stop.zip
                            },
                            weather: {
                                temperature: expect.any(String),
                                condition: expect.any(String),
                                windSpeed: expect.any(String)
                            },
                            attendance: stop.attendance,
                        }
                    ],
                });
            });
    });

    it('deletes a stop from a tour', () => {
        const tourId = createdTours[1]._id;
        const stop = { zip: '97212', attendance: 375 };
        return request(app)
            .post(`/tours/${tourId}/stops`)
            .send(stop)
            .then(tourWithStop => {
                const stopId = tourWithStop.body.stops[0]._id;
                return request(app)
                    .delete(`/tours/${tourId}/stops/${stopId}`)
                    .then(result => {
                        expect(result.body).toEqual(createdTours[1]);
                    });
            });
    });

    it('updates the attendance at a stop', () => {
        const tourId = createdTours[1]._id;
        const stop = { zip: '97212', attendance: 375 };
        return request(app)
            .post(`/tours/${tourId}/stops`)
            .send(stop)
            .then(tourWithStop => {
                const stopId = tourWithStop.body.stops[0]._id;
                return request(app)
                    .put(`/tours/${tourId}/stops/${stopId}/attendance`)
                    .send({ attendance: 200 })
                    .then(result => {
                        expect(result.body.stops[0].attendance).toEqual(200);
                    });
            });

    });

});

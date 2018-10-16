require('dotenv').config();
const getZipCodeData = require('../lib/util/zip-middleware');

describe('test the middleware that uses weather api', () => {

    it('sends back an HttpError if zip code is not provided', done => {
        const req = { body: { zip: '' } } ;

        let error;
        const next = err => {
            error = err;
            expect(error.code).toEqual(400);
            done();
        };

        getZipCodeData(req, null, next);
    });

    it('returns the weather/location data when passed a request with a zip code', done => {
        const req = { body: { zip: '97229' } } ;

        const next = () => {
            expect(req.body.weather).toEqual({
                temperature: expect.any(String),
                condition: expect.any(String),
                windSpeed: expect.any(String),
                windDir: expect.any(String),
                sunrise: expect.any(String),
                sunset: expect.any(String)
            });
            expect(req.body.location).toEqual({
                city: expect.any(String),
                state: expect.any(String),
                country: expect.any(String),
                elevation: expect.any(String),
            });
            done();
        };

        getZipCodeData(req, null, next);
    });
});
require('dotenv').config();
const router = require('express').Router();
const Tour = require('../models/Tour');
const zipMiddleware = require('../util/zip-middleware');

module.exports = router

    .post('/tours', (req, res, next) => {
        const { title, activities, launchDate } = req.body;
        Tour.create({ title, activities, launchDate })
            .then(tour => res.json(tour))
            .catch(next);
    })

    .get('/tours', (req, res, next) => {
        Tour.find()
            .then(results => res.json(results))
            .catch(next);
    })

    .get('/tours/:id', (req, res, next) => {
        const { id } = req.params;
        Tour.findById(id)
            .then(tour => res.json(tour))
            .catch(next);
    })

    .post('/tours/:id/stops', zipMiddleware(), (req, res, next) => {
        const { id } = req.params;
        const { attendance } = req.body;
        const { city, state, zip } = req.body.location;
        const { temperature, condition, windSpeed } = req.body.weather;
        const stop = {
            location: { city, state, zip },
            weather: { temperature, condition, windSpeed },
            attendance
        };
        Tour
            .findByIdAndUpdate(id,
                { $push: { stops: stop } },
                { new: true, runValidators: true }
            )
            .lean()
            .then(updatedTour => res.json(updatedTour))
            .catch(next);
    });
  
    
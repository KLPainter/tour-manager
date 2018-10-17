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

    .post('/tours/:id/stops', zipMiddleware, (req, res, next) => {
        const { id } = req.params;
        const { attendance, zip } = req.body;
        const { city, state } = req.body.location;
        const { temperature, condition, windSpeed } = req.body.weather;
        const stop = {
            location: { city, state, zip },
            weather: { temperature, condition, windSpeed },
            attendance
        };
        Tour.findByIdAndUpdate(id,
            { $push: { stops: stop } },
            { new: true, runValidators: true }
        )
            .lean()
            .then(updatedTour => res.json(updatedTour))
            .catch(next);
    })

    .delete('/tours/:tourId/stops/:stopId', (req, res, next) => {
        const { tourId, stopId } = req.params;
        Tour.findByIdAndUpdate(tourId, 
            { $pull: { stops: { _id: stopId } } }, 
            { new: true }
        )
            .lean()
            .then(updatedTour => res.json(updatedTour))
            .catch(next);
    })
  
    .put('/tours/:tourId/stops/:stopId/attendance', (req, res, next) => {
        const { tourId, stopId } = req.params;
        const { attendance } = req.body;
        Tour.findOneAndUpdate(
            { '_id': tourId, 'stops._id': stopId }, 
            { $set: { 'stops.$.attendance': attendance } }, 
            { new: true }
        )
            .lean()
            .then(updatedTour => res.json(updatedTour))
            .catch(next);
    });

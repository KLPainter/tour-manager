const router = require('express').Router();
const Tour = require('../models/Tour');

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
    });
  
    
const router = require('express').Router();
const Tour = require('../models/Tour');

module.exports = router

    .post('/tours', (req, res) => {
        const { title, activities, launchDate } = req.body;
        Tour.create({ title, activities, launchDate })
            .then(tour => res.json(tour));
    });
  
    
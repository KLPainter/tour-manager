const router = require('express').Router();
const Tour = require('../models/Tour');
//const Stop = require('../models/Stop');

module.exports = router

    .post('/tours', (req, res) => {
        const { title, activities, launchDate, stops } = req.body;
        Tour.create({ title, activities, launchDate, stops }).then(tour => res.json(tour));
    });
  
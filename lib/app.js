const express = require('express');
const app = express();

app.use(express.json());

const tours = require('./routes/tours');
app.use('/', tours);

module.exports = app;
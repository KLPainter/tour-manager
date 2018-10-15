const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    activities: [String],
    launchDate: {
        type: Date,
        default: Date.now()
    },
    stops: [
        {
            location: {
                city: String,
                state: String,
                zip: String
            },
            weather: {
                temperature: String,
                condition: String,
                windSpeed: String
            },
            attendance: {
                type: Number,
                min: 1
            }
        }
    ],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

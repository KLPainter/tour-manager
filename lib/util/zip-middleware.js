const { HttpError } = require('./errors');
const getLocationWeather = require('./weather-service');

module.exports = (req, res, next) => {
    const { zip } = req.body;

    if(!zip) {
        const error = new HttpError({
            code: 400,
            message: 'Bad request: Zip code required'
        });
        return next(error);
    }

    getLocationWeather(zip)
        .then(apiResponse => {
            req.body.weather = apiResponse.weather;
            req.body.location = apiResponse.location;
            next();
        });
};
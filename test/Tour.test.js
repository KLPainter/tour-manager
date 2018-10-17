const Tour = require('../lib/models/Tour');

describe ('Tour model', () => {

    const sampleTour =  { 
        title: 'Tour Stop 1', 
        activities: ['trapeze', 'pie eating'], 
        stops: [
            {
                location: {
                    city: 'Oklahoma City',
                    state: 'OK',
                    zip: '73132'
                },
                weather: {
                    temperature: 'Hotter than heck!',
                    condition: 'Dull',
                    windSpeed: 'Gusty'
                },
                attendance:123
            }
        ]
    };

    it('validates a good model', () => {
        const tour = new Tour(sampleTour);
        const jsonTour = tour.toJSON();
        expect(jsonTour).toEqual({ 
            _id: expect.any(Object),
            title: sampleTour.title, 
            activities: sampleTour.activities, 
            launchDate: expect.any(Date),
            stops: [
                {
                    _id: expect.any(Object),
                    location: sampleTour.stops[0].location,
                    weather: sampleTour.stops[0].weather,
                    attendance: sampleTour.stops[0].attendance
                }
            ]
        });
    });

    it('requires a title', () => {
        const tour = new Tour(sampleTour);
        tour.title = '';
        const errors = getErrors(tour.validateSync(), 1);
        expect(errors.title.properties.message).toEqual('Path `title` is required.');
    });

});

const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined();
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};
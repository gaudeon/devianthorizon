// Store for all models

var models = {
    character : require('./models/character'),
    room      : require('./models/place'),
    session   : require('./models/session'),
    user      : require('./models/user')
};

module.exports = models;
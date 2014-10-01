// Store for all models

var models = {
    character : require('./models/character'),
    place     : require('./models/place'),
    region    : require('./models/region'),
    session   : require('./models/session'),
    user      : require('./models/user')
};

module.exports = models;
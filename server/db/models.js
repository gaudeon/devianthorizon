// Store for all models

var models = {
    character : require('./models/character'),
    session   : require('./models/session'),
    user      : require('./models/user')
};

module.exports = models;
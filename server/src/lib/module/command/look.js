// Look command

var Command = require('../command'),
    PlaceModule = require('../place');

var LookCommand = function(app, world) {
    var self = new Command();
    
    self.app = app;
    
    self.world = world;

    self.id = 'look';

    self.regex = RegExp('^look');

    self.indexes = [
        'look'
    ];

    self.help = {
        'title'    : 'Look',
        'header'   : 'look',
        'body'     : 'Look around',
        'footer'   : ''
    };

    self.execute = function(cmdLine, character, callback) {
        new PlaceModule().findMe({ id: character.place }, function(place) {
            var output = place.summary();
            
            if('function' === typeof callback) callback({
                place     : place,
                output    : output
            });
        });
    };

    return self;
};

module.exports = LookCommand;

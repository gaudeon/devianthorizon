// Look command

var Command = require('../command'),
    PlaceModule = require('../place');

var LookCommand = function(world) {
    var self = new Command();
    
    self.world = world;

    self.id = 'look';

    self.regex = RegExp('^look');

    self.indexes = [
        'look'
    ];
    
    self.permissionGroups = [ 'character' ];

    self.help = {
        'title'    : 'Look',
        'header'   : 'look',
        'body'     : 'Look around',
        'footer'   : ''
    };

    self.runCMD = function(args, callback) {
        new PlaceModule().findMe({ id: args.character.place() }, function(place) {
            var output = place.summary();
            
            callback({
                place     : place.model.toObject(),
                output    : output
            });
        });
    };

    return self;
};

module.exports = LookCommand;

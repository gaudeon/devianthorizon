// Teleport command

var Command = require('../command'),
    PlaceModule = require('../place');

var TeleportCommand = function(world) {
    var self = new Command();
    
    self.world = world;

    self.id = 'teleport';

    self.regex = RegExp('^teleport');

    self.indexes = [
        'teleport'
    ];

    self.help = {
        'title'    : 'Teleport',
        'header'   : 'teleport',
        'body'     : 'Teleport to a place',
        'footer'   : 'ADMIN ONLY' // TODO: implement character roles (such as admin). Then implement admin privileges and make sure the server app calls to commands has them by default.
    };

    self.runCMD = function(args, callback) {
        var place_id = args.words[1];
        
        try {
            new PlaceModule().findMe({ id: place_id }, function(place) {
                args.character.setPlace(place, function() {
                    callback({
                        place     : place.model.toObject(),
                        character : args.character.model.toObject()
                    });
                });
            });
        }
        catch(error) {
            callback({
                output: "Could not place to teleport to."
            });
        }
    };

    return self;
};

module.exports = TeleportCommand;

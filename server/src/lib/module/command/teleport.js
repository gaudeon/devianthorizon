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
    
    self.permissionGroups = [ 'internal' ];

    self.help = {
        'title'    : 'Teleport',
        'header'   : 'teleport',
        'body'     : 'Teleport to a place',
        'footer'   : 'INTERNAL ONLY' 
    };

    self.runCMD = function(args, callback) {
        var place_id = args.words[1];
        
        new PlaceModule().findMe({ id: place_id }, function(place) {
            if(! place) {
                callback({
                    output: "Teleport destination does not exist."
                });
                return;
            }
            
            args.character.setPlace(place, function() {
                callback({
                    place     : place.model.toObject(),
                    character : args.character.model.toObject()
                });
            });
        });
    };

    return self;
};

module.exports = TeleportCommand;

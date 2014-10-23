// Teleport command

var Command = require('../command'),
    PlaceModule = require('../place');

var SysTeleportCommand = function(world) {
    var self = new Command();

    self.world = world;

    self.id = 'sys_teleport';

    self.regex = RegExp('^\\bsys_teleport\\b');

    self.indexes = [
        'sys_teleport'
    ];

    self.permissionGroups = [ 'internal' ];

    self.help = {
        'title'    : 'System Teleport',
        'header'   : 'Usage: sys_teleport',
        'body'     : 'System call to teleport character to a place',
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

module.exports = SysTeleportCommand;

// Walk command

var Command     = require('../command'),
    PlaceModule = require('../place'),
    GateModule  = require('../gate'),
    _           = require('underscore');

var WalkCommand = function(world) {
    'use strict';
    
    var self = new Command();

    self.world = world;

    self.id = 'walk';

    self.regex = new RegExp('^\\bwalk\\b');

    self.indexes = [
        'walk'
    ];

    self.permissionGroups = [ 'character' ];

    self.help = {
        'title'    : 'Walk',
        'header'   : 'Usage: walk [direction]',
        'body'     : 'Walk to a new place',
        'footer'   : ''
    };

    self.runCMD = function(args, callback) {
        var direction = new GateModule().translateDirection({ 'direction' : args.words[1] });

        new PlaceModule().findMe({ 'id' : args.character.place() }, function(source) {

            source.gates(function(gates) {
                var gate = (_.filter(gates, function(g) { return g.direction() === direction; }))[0];

                if(gate) {
                    new PlaceModule().findMe({ 'id' : gate.destination() }, function(destination) {

                        // remove character from current location
                        args.character.unsetPlace(function() {

                            // move the character to his/her/it's new location
                            args.character.setPlace(destination, function() {

                                // look...
                                args.kernel.execute({
                                    'cmdLine'  : 'look',
                                    'session'  : args.session,
                                    'callback' : function(d) {
                                        callback(d);
                                    },
                                    'internal' : true
                                });

                            });

                        });

                    });
                }
                else {
                    var output = 'You are unable to find a clear path to walk in that direction.';

                    callback({
                        'place'  : source.model.toObject(),
                        'output' : output
                    });
                }
            });

        });
    };

    return self;
};

module.exports = WalkCommand;

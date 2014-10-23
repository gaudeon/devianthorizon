// Look command

var Command     = require('../command'),
    PlaceModule = require('../place');

var LookCommand = function(world) {
    'use strict';
    
    var self = new Command();

    self.world = world;

    self.id = 'look';

    self.regex = new RegExp('^\\blook\\b');

    self.indexes = [
        'look'
    ];

    self.permissionGroups = [ 'character' ];

    self.help = {
        'title'    : 'Look',
        'header'   : 'Usage: look',
        'body'     : 'Look around',
        'footer'   : ''
    };

    self.runCMD = function(args, callback) {
        new PlaceModule().findMe({ id: args.character.place() }, function(place) {
            place.summary(function(output) {
                callback({
                    'place'  : place.model.toObject(),
                    'output' : output
                });
            });
        });
    };

    return self;
};

module.exports = LookCommand;

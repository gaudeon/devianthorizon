// World socket.io handler

var Response        = require('./response'),
    _               = require('underscore'),
    WorldModule     = require('../../lib/module/world'),
    CharacterModule = require('../../lib/module/character');

var World = function(app) {
    var self = this;

    initialize();

    function initialize() {
        self.app = app;
        
        self.socket = self.app.io
            .of('/world')
            .on('connection', function (socket) {
                // Connected to world
                _.each(['joinWorld','enterWorld','command'], function(method) {
                    socket.on(method, function(data, callback) {
                        self[method](data, function(resp) {
                            if('function' === typeof callback) callback(resp);
                        });
                    });
                });
            });
        
        // World management
        self.the_world = new WorldModule();
    }
    
    // request from a user to join the world with a select character
    self.joinWorld = function(data, callback) {
        var resp;
        
        new CharacterModule().findMe({ id: data.character }, function(character) {
            self.the_world.findSpawnPoint(function(place) {
                character.logout(); // Logout first, just in case
                
                character.setPlace(place, function() {
                    // Set the character in the session for later access
                    var sessionData = self.app.client.session.sessionData;
                    sessionData.character = character.model.toObject();
                    self.app.client.session.sessionData = sessionData;
                    self.app.client.session.save();
                    
                    resp = new Response(true, 'Character logged in.', {
                        args: data,
                        result: {
                            character : character.model.toObject(),
                            place     : place.model.toObject()
                        }
                    });
                    
                    if('function' === typeof callback) callback(resp);
                });
            });
        });
        
    };
    
    // game interface is active, show welcome message and current place
    self.enterWorld = function(data, callback) {
        new CharacterModule().findMe({ id: self.app.client.session.sessionData.character._id }, function(character) {
            self.the_world.enterPlace(character, { id: character.model.place }, function(resp) {
                // Update character
                var sessionData = self.app.client.session.sessionData;
                sessionData.character = resp.character.model.toObject();
                self.app.client.session.sessionData = sessionData;
                self.app.client.session.save();
                
                // Send response
                resp = new Response(true, 'Character entered world.', {
                    args: data,
                    result: {
                        character : resp.character.model.toObject(),
                        place     : resp.place.model.toObject(),
                        output    : resp.output
                    }
                });
                
                if('function' === typeof callback) callback(resp);
            });
        });
        
    };
    
    // client sent command
    self.command = function(data, callback) {
        
    }
    
    return self;
};

module.exports = World;

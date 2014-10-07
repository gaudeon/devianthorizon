// World socket.io handler

var Response        = require('./response'),
    _               = require('underscore'),
    WorldModule     = require('../../lib/module/world'),
    CharacterModule = require('../../lib/module/character'),
    KernelModule    = require('../../lib/module/kernel');

var World = function(app) {
    var self = this;

    self.initialize = function() {
        self.app = app;

        self.socket = self.app.io
            .of('/world')
            .on('connection', function (socket) {
                // Connected to world
                _.each(['joinWorld','enterWorld','execCommand'], function(method) {
                    socket.on(method, function(data, callback) {
                        self[method](data, function(resp) {
                            if('function' === typeof callback) callback(resp);
                        });
                    });
                });
            });

        // World management
        self.the_world = new WorldModule();

        // Command Parsing / Execution
        self.kernel = new KernelModule(self.the_world);
    };

    // request from a user in the lobby to join the world with a select character
    self.joinWorld = function(data, callback) {
        var resp;
        
        new CharacterModule(self.app).findMe({ id: data.character }, function(character) {
            self.the_world.findSpawnPoint(function(place) {
                character.logout(); // Logout first, just in case

                character.setPlace(place, function() {
                    
                    // Set the character in the session and world for later access
                    self.app.client.session.sessionCharacter( character.model.toObject() );
                    
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
        new CharacterModule(self.app).findMe({ id: self.app.client.session.sessionCharacter()._id }, function(character) {
            self.the_world.enterPlace(character, { id: character.model.place }, function(resp) {
                // Update character
                self.app.client.session.sessionCharacter( resp.character.model.toObject() );
                
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
    self.execCommand = function(data, callback) {
        try {
            self.kernel.parse(data.command || '', self.app.client.session.sessionCharacter(), function(result) {
                resp = new Response(true, 'Character entered world.', {
                    args: data,
                    result: result
                });
                
                if('function' === typeof callback) callback(resp);
            });
            
        }
        catch(err) {
            resp = new Response(false, err, { args: data, result: { output: err } });
            if('function' === typeof callback) callback(resp);
        }
    };
    
    self.initialize();

    return self;
};

module.exports = World;

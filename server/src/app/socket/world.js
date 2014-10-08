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
            character.logout(); // Logout first, just in case
            
            // Store this character in the current session
            self.app.client.session.sessionCharacter( character.model.toObject() );
            
            var place_id = character.place();
            
            if(! place_id) {
                self.the_world.findSpawnPoint(function(place) {
                    self.kernel.execute({
                        cmdLine: 'teleport ' + place.id(),
                        session: self.app.client.session,
                        callback: function(d) {
                            var resp = new Response(true, 'Character logged in.', {
                                args: data,
                                result: d
                            });
                            
                            if('function' === typeof callback) callback(resp);
                        }
                    });
    
                    
                });
            }
            else {
                self.kernel.execute({
                    cmdLine: 'teleport ' + place_id,
                    session: self.app.client.session,
                    callback: function(d) {
                        var resp = new Response(true, 'Character logged in.', {
                            args: data,
                            result: d
                        });
                        
                        if('function' === typeof callback) callback(resp);
                    }
                });
            }
        });

    };

    // game interface is active, show welcome message and current place by 'looking'
    self.enterWorld = function(data, callback) {
        self.kernel.execute({
            cmdLine: 'look',
            session: self.app.client.session,
            callback: function(d) {
                var resp = new Response(true, 'Character entered world.', {
                    args: data,
                    result: d
                });
                
                if('function' === typeof callback) callback(resp);
            }
        });
    };

    // client sent command
    self.execCommand = function(data, callback) {
        try {
            self.kernel.execute({
                cmdLine  : data.command || '',
                session  : self.app.client.session,
                callback : function(result) {
                    resp = new Response(true, 'Character entered world.', {
                        args: data,
                        result: result
                    });
                    
                    if('function' === typeof callback) callback(resp);
                }
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

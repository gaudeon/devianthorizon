// World socket.io handler

var Response = require('./response'),
    _ = require('underscore'),
    WorldModule = require('../../lib/module/world');

var World = function(app) {
    var self = this;

    initialize();

    function initialize() {
        self.app = app;
        
        self.socket = self.app.io
            .of('/world')
            .on('connection', function (socket) {
                // Connected to world
                _.each(['joinWorld'], function(method) {
                    socket.on(method, function(data, callback) {
                        self[method](data, function(resp) {
                            callback(resp);
                        });
                    });
                });
            });
        
        // World management
        self.the_world = new WorldModule();
    }
    
    self.joinWorld = function(data, callback) {
        var resp;
        
        resp = new Response(true, 'Character logged in.', {
            args: data,
            result: {
                // DEBUG - testing world generation
                debug: self.the_world.generate()
            }
        });
        
        callback(resp);
    };

    return self;
};

module.exports = World;

// Entry point to mud server

var db = require('../db/models'),
    SessionModule = require('./lib/module/session');

var ServerApp = function(express, http, request, response) {
    var self = this;
    
    initialize();
    
    function initialize() {
        // -- Setup default environment
        self.express   = express;
        self.http      = http;
        self.request   = request;
        self.response  = response;
        self.db        = db;
        self.client    = {};
        self.client.ip = self.request.ip;
        
        // -- Load or create session
        self.client.session = new SessionModule(self);
        self.client.session.findOrCreate(function() { // wait for the session loading to complete before continuing
            // -- Setup socket connections
            self.io      = require('socket.io').listen(http);
            
            self.login   = require('./app/socket/login')(self);
            self.lobby   = require('./app/socket/lobby')(self);
            self.world   = require('./app/socket/world')(self);
        });
    }
    
    return self;
};

module.exports = ServerApp;

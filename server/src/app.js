// Entry point to mud server

var ServerApp = function(express, http) {
    var self = this;

    initialize(express, http);

    function initialize(express, http) {
        self.express = express;
        self.http    = http;
        
        self.io      = require('socket.io').listen(http);
        
        self.login   = require('./app/socket/login')(self.io);
        self.world   = require('./app/socket/world')(self.io);
    }

    return self;
};

module.exports = ServerApp;

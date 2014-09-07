// Entry point to mud client

// NOTE: I need to get Grunt and browserfy setup so I can start building the client and require in other sub modules like I can on the server (so I can have a world and login equivalent on client side for socket.io)

var MUD = (function() {
    var self = this;

    initialize();

    function initialize() {
        //self.login = require('./mud/login'); TODO: get browserfy working
        //self.world = require('./mud/world');
    }

    return self;
});

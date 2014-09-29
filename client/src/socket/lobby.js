// Login socket.io handler

var io = require('socket');

var Lobby = (function() {
    var self = this;

    initialize();

    function initialize() {
        self.socket = io.connect('/lobby');
    }
    
    self.userInfo = function(callback) {
        self.socket.emit(
            'userInfo',
            {},
            callback
        );
    };

    return self;
});

module.exports = new Lobby();

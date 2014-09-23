// Login socket.io handler

var io = require('socket');

var Login = (function() {
    var self = this;

    initialize();

    function initialize() {
        self.socket = io.connect('/login');
        //self.socket.emit('connect', { username: 'test' });
    }

    return self;
});

module.exports = new Login();

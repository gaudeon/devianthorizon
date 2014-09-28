// Login socket.io handler

var io = require('socket');

var Login = (function() {
    var self = this;

    initialize();

    function initialize() {
        self.socket = io.connect('/login');
    }
    
    self.auth = function(username, password, callback) {
        self.socket.emit('auth', {
            username: username,
            password: password
        }, callback);
    };

    return self;
});

module.exports = new Login();

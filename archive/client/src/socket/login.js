// Login socket.io handler

var io = require('socket');

var Login = (function() {
    'use strict';
    
    var self = {};

    initialize();

    function initialize() {
        self.socket = io.connect('/login');
    }
    
    self.auth = function(data, callback) {
        self.socket.emit(
            'auth',
            _.pick(data, ['username', 'password']),
            callback
        );
    };
    
    self.register = function(data, callback) {
        self.socket.emit(
            'register',
            _.pick(data, ['first_name', 'last_name', 'email', 'username', 'password']) ,
            callback
        );
    };

    return self;
});

module.exports = new Login();

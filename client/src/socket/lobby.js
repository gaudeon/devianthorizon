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
    
    self.createCharacter = function(data, callback) {
        self.socket.emit(
            'createCharacter',
            _.pick(data, ['full_name']),
            callback
        );
    };
    
    self.characterList = function(callback) {
        self.socket.emit(
            'characterList',
            {},
            callback
        );
    };

    return self;
});

module.exports = new Lobby();

// World socket.io handler

var io = require('socket');

var World = (function() {
    var self = this;

    initialize();

    function initialize() {
        self.socket = io.connect('/world');
    }
    
    self.joinWorld = function(data, callback) {
        self.socket.emit(
            'joinWorld',
            _.pick(data, ['character']),
            callback
        );
    };
    
    self.enterWorld = function(callback) {
        self.socket.emit(
            'enterWorld',
            {},
            callback
        );
    };
    
    self.execCommand = function(data, callback) {
        self.socket.emit(
            'execCommand',
            _.pick(data, ['command']),
            callback
        );
    };

    return self;
});

module.exports = new World();

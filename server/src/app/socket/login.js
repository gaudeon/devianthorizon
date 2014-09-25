// Login socket.io handler

var Response = require('./response');

var Login = function(io) {
    var self = this;

    initialize(io);

    function initialize(io) {
        self.io = io;
        
        self.socket = self.io
            .of('/login')
            .on('connection', function(socket) {
                socket.on('auth', function(data) {
                    socket.emit('auth', self.auth(data));
                });
            });
    }
   
    self.auth = function(username, password) {
        var resp = new Response(true, 'Authentication was successful', { username: username });
        
        return resp;
    };

    return self;
};

module.exports = Login;

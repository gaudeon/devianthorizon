// Login socket.io handler

var Login = function(io) {
    var self = this;

    initialize(io);

    function initialize(io) {
        self.io = io;
        
        self.socket = self.io
            .of('/login')
            .on('connection', function(socket) {
                // Connected to login
                // Use mud.login here
                socket.on('connect', function(data) {
                    console.log('client connected to login');
                });
            });
    }

    return self;
};

module.exports = Login;

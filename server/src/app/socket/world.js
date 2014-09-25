// World socket.io handler

var World = function(io) {
    var self = this;

    initialize(io);

    function initialize(io) {
        self.io = io;
        
        self.socket = self.io
            .of('/world')
            .on('connection', function (socket) {
                // Connected to world
                // Use mud.world here
            });
    }

    return self;
};

module.exports = World;

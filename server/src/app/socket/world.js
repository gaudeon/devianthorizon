// World socket.io handler

var World = function(app) {
    var self = this;

    initialize();

    function initialize() {
        self.app = app;
        
        self.socket = self.app.io
            .of('/world')
            .on('connection', function (socket) {
                // Connected to world
                // Use mud.world here
            });
    }

    return self;
};

module.exports = World;

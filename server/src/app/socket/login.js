// Login socket.io handler

var Response = require('./response');

var Login = function(app) {
    var self = this;

    initialize();

    function initialize() {
        self.app = app;
        
        self.socket = self.app.io
            .of('/login')
            .on('connection', function(socket) {
                socket.on('auth', function(data, callback) {
                    self.auth(data, function(resp) {
                        callback(resp);
                    });
                });
            });
    }
   
    self.auth = function(data, callback) {
        self.app.db.user.findOne({ username: data.username }, function(err, doc) {
            var resp;
            
            if(err) {
                resp = new Response(false, 'A database exception occurred while attempting to process your request', data);
            }
            else {
                if(doc) {
                    if(doc.checkPassword(data.password)) {
                        resp = new Response(true, 'Authentication was successful', data);
                    }
                    else {
                        resp = new Response(false, 'Invalid username or password', data);
                    }
                }
                else {
                    resp = new Response(false, 'Invalid username or password', data);
                }
            }
            
            callback(resp);
        });
    };

    return self;
};

module.exports = Login;

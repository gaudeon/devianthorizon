// Login socket.io handler

var io = require('socket');

var Login = (function() {
    var self = this;

    initialize();

    function initialize() {
        self.socket = io.connect('/login');
        self.socket.emit('auth', { username: 'test' });
        self.socket.on('auth', function(resp) {
            self.pAuth = new Promise(function(resolve, reject) {
                if(resp.success) {
                    resolve(resp);
                }
                else {
                    reject(Error(resp));
                }
            });
        });
    }
    
    self.auth = function(username, password, callback) {
        self.socket.emit('auth', {
            username: username,
            password: password
        });
        
        if('function' === typeof callback) {
            self.pAuth.then(function(resp) {
                callback(resp);
            });
        }
    };

    return self;
});

module.exports = new Login();

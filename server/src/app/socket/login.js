// Login socket.io handler

var Response = require('./response'),
    _ = require('underscore');

var Login = function(app) {
    var self = this;

    initialize();

    function initialize() {
        self.app = app;
        
        self.socket = self.app.io
            .of('/login')
            .on('connection', function(socket) {
                // Socket namespace hooks
                _.each(['auth', 'register'], function(method) {
                    socket.on(method, function(data, callback) {
                        self[method](data, function(resp) {
                            callback(resp);
                        });
                    });
                });
            });
    }
   
    self.auth = function(data, callback) {
        self.app.db.user.findOne({ userName: data.username }, function(err, doc) {
            var resp;
            
            if(err) {
                resp = new Response(false, err.err || err, { args: data });
                callback(resp);
            }
            else {
                if(doc) {
                    doc.checkPassword(data.password, function(err, isMatch) {
                        if(isMatch) {
                            // Set the user in the session for later access
                            var sessionData = self.app.client.session.get('sessionData') || {};
                            sessionData.user = doc.toObject();
                            self.app.client.session.set( 'sessionData', sessionData);
                            
                            resp = new Response(true, 'Authentication was successful', { args: data, result: doc });
                        }
                        else {
                            resp = new Response(false, 'Invalid username or password', { args: data });
                        }
                        
                        callback(resp);
                    });
                }
                else {
                    resp = new Response(false, 'Invalid username or password', { args: data });
                    callback(resp);
                }
            }
        });
    };
    
    self.register = function(data, callback) {
        self.app.db.user.findOne({ userName: data.username }, function(err, doc) {
            var resp;
            
            if(err) {
                resp = new Response(false, err.err || err, { args: data });
                callback(resp);
            }
            else {
                if(doc) {
                    resp = new Response(false, 'Username is already taken.', { args: data });
                    callback(resp);
                }
                else {
                    self.app.db.user.create({
                        firstName    : data.first_name,
                        lastName     : data.last_name,
                        emailAddress : data.email,
                        userName     : data.username,
                        userPassword : data.password
                    }, function(err, doc) {
                        if(err) {
                            resp = new Response(false, err.err || err, { args: data });
                        }
                        else {
                            resp = new Response(true, 'Registration was successful', { args: data, result: doc });
                        }
                        
                        callback(resp);
                    });
                }
            }
        });
    }

    return self;
};

module.exports = Login;

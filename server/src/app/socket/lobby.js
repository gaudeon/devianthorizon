// Lobby socket.io handler

var Response = require('./response'),
    _ = require('underscore');

var Lobby = function(app) {
    var self = this;

    initialize();

    function initialize() {
        self.app = app;
        
        self.socket = self.app.io
            .of('/lobby')
            .on('connection', function (socket) {
                // Socket namespace hooks
                _.each(['userInfo'], function(method) {
                    socket.on(method, function(data, callback) {
                        self[method](data, function(resp) {
                            callback(resp);
                        });
                    });
                });
            });
    }
    
    self.userInfo = function(data, callback) {
        var resp;
        var sessionData = self.app.client.session.get('sessionData') || {};
        
        if(sessionData.user) {
            resp = new Response(true, 'UserInfo found.', {
                args: data,
                result: {
                    id          : sessionData.user['_id'],
                    first_name  : sessionData.user.firstName,
                    last_name   : sessionData.user.lastName,
                    email       : sessionData.user.emailAddress,
                    username    : sessionData.user.userName,
                    created     : sessionData.user.createdDate
                }
            });
        } else {
            resp = new Response(false, 'User is not logged in.', { args: data });
        }
        
        callback(resp);
    };

    return self;
};

module.exports = Lobby;

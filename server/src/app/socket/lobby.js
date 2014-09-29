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
                _.each(['userInfo', 'createCharacter','characterList'], function(method) {
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
        var sessionData = self.app.client.session.sessionData || {};
        
        if(sessionData.user) {
            resp = new Response(true, 'UserInfo found.', {
                args: data,
                result: {
                    id          : sessionData.user._id,
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
    
    self.createCharacter = function(data, callback) {
        self.app.db.character.findOne({ fullName: data.full_name }, function(err, doc) {
            var resp;
            
            if(err) {
                resp = new Response(false, err.err || err, { args: data });
                callback(resp);
            }
            else {
                if(doc) {
                    resp = new Response(false, 'Name is already taken.', { args: data });
                    callback(resp);
                }
                else {
                    self.app.db.character.create({
                        ownedBy  : self.app.client.session.sessionData.user._id,  
                        fullName : data.full_name
                    }, function(err, doc) {
                        if(err) {
                            resp = new Response(false, err.err || err, { args: data });
                        }
                        else {
                            resp = new Response(true, 'Character created successfully', { args: data, result: doc });
                        }
                        
                        callback(resp);
                    });
                }
            }
        });
    };
    
    self.characterList = function(data, callback) {
        self.app.db.character.find({ ownedBy: self.app.client.session.sessionData.user._id }, function(err, docs) {
            var resp;
            
            if(err) {
                resp = new Response(false, err.err || err, { args: data });
            }
            else {
                resp = new Response(true, 'Query successful.', { args: data, result: docs });
            }
            
             callback(resp);
        });
    };

    return self;
};

module.exports = Lobby;

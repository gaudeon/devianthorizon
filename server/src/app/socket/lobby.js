// Lobby socket.io handler

var Response = require('./response'),
    _ = require('underscore'),
    CharacterModule = require('../../lib/module/character');

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
        var sessionUser = self.app.client.session.sessionUser();
        
        if(sessionUser) {
            resp = new Response(true, 'UserInfo found.', {
                args: data,
                result: {
                    id          : sessionUser._id,
                    first_name  : sessionUser.firstName,
                    last_name   : sessionUser.lastName,
                    email       : sessionUser.emailAddress,
                    username    : sessionUser.userName,
                    created     : sessionUser.createdDate
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
                    try {
                        new CharacterModule().createMe({
                            ownedBy  : self.app.client.session.sessionUser()._id,  
                            fullName : data.full_name
                        }, function(character) {
                            resp = new Response(true, 'Character created successfully', { args: data, result: character.model });
                            callback(resp);
                        });
                    }
                    catch(err) {
                        resp = new Response(false, err.err || err, { args: data });
                    }
                }
            }
        });
    };
    
    self.characterList = function(data, callback) {
        self.app.db.character.find({ ownedBy: self.app.client.session.sessionUser()._id }, function(err, docs) {
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

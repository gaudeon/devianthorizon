// Session handler

var Module       = require('../module'),
    SessionModel = require('../../../db/models/session');

var Session = function(app) {
    'use strict';
    
    var self = new Module();
    
    initialize();

    function initialize() {
        self.app = app;
    }
    
    function expireNext() { return new Date(Date.now() + 1000 * 60 * 60 * 1); }
    
    // Create a new session
    function newSession(callback) {
        self.app.client.session = self.app.db.session.create({ ipAddress: self.app.client.ip, expireDate: expireNext() }, function(err, doc) {
            if(err)
                throw err;
            
            self.model = doc;
            
            self.updateCookieSessionExpires(callback);
        });
    }

    // Find or create a new session
    self.findOrCreate = function(callback) {
        if( self.app.request.signedCookies.mudjs_session && self.app.request.signedCookies.mudjs_session.token ) {
            // try to load the session
            SessionModel.findOne({ ipAddress: self.app.client.ip, tokenString: self.app.request.signedCookies.mudjs_session.token }, function(err, doc) {
                if(err)
                    throw err;
                
                if(doc) {
                    self.model = doc;
                    
                    self.updateCookieSessionExpires(callback);
                }
                else {
                    newSession(callback);
                }
            });
        }
        else {
            newSession(callback);
        }
        
    };
    
    self.updateCookieSessionExpires = function(callback) {
        if('undefined' === typeof self.model)
            throw "session not defined!";
        
        // Create/update session cookie        
        self.app.response.cookie('mudjs_session', { token: self.model.tokenString }, { expires: expireNext(), signed: true });
        
        // Update session expiration
        self.model.expireDate = expireNext();
        self.model.save(function(err) {
            if(err) throw err;
            
            if('function' === typeof callback) callback();
        });
    };
    
    self.sessionData = function() {
        return self.model.sessionData;
    };
    
    self.sessionUser = function(update, callback) {
        if(update) {
            var sessionData = self.model.sessionData;
            sessionData.user = update;
            self.model.sessionData = sessionData;
            self.model.save(function(err, doc) {
                if(err) throw err;
                
                if('function' === typeof callback) callback(self.model.sessionData.user);
            });
        }
        
        return self.model.sessionData.user;
    };
    
    self.sessionCharacter = function(update, callback) {
        if(update) {
            var sessionData = self.model.sessionData;
            sessionData.character = update;
            self.model.sessionData = sessionData;
            self.model.save(function(err, doc) {
                if(err) throw err;
                
                if('function' === typeof callback) callback(self.model.sessionData.character);
            });
        }
        
        return self.model.sessionData.character;
    };

    return self;
};

module.exports = Session;

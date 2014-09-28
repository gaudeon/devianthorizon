// Entry point to mud server

var db = require('../db/models');

var ServerApp = function(express, http, request, response) {
    var self = this;
    
    initialize();
    
    function initialize() {
        // -- Setup default environment
        self.express   = express;
        self.http      = http;
        self.request   = request;
        self.response  = response;
        self.db        = db;
        self.client    = {};
        self.client.ip = self.request.ip;
        
        // -- Load or create session
        if( self.request.signedCookies.mudjs_session && self.request.signedCookies.mudjs_session.token ) {
            // try to load the session
            self.db.session.findOne({ ipAddress: self.client.ip, tokenString: self.request.signedCookies.mudjs_session.token }, function(err, doc) {
                if(err)
                    throw err;
                
                if(doc) {
                    self.client.session = doc;
                    updateCookieSessionExpires();
                }
                else {
                    newSession();
                }
            });
        }
        else {
            newSession();
        }
        
        // -- Setup socket connections
        self.io      = require('socket.io').listen(http);
        
        self.login   = require('./app/socket/login')(self.io);
        self.world   = require('./app/socket/world')(self.io);
    }
    
    function newSession() {
        self.client.session = self.db.session.create({ ipAddress: self.client.ip }, function(err, doc) {
            if(err)
                throw err;
            
            self.client.session = doc;
            
            updateCookieSessionExpires();
        });
    }
    
    function updateCookieSessionExpires() {
        if('undefined' === typeof self.client.session)
            throw "session not defined!";
        
        // Create/update session cookie        
        self.response.cookie('mudjs_session', { token: self.client.session.get('tokenString') }, { expires: new Date(Date.now() + 1000 * 60 * 1), signed: true });
        
        // Update session expiration
        self.client.session.updateExpireDate();
    }
    
    return self;

     
};

module.exports = ServerApp;

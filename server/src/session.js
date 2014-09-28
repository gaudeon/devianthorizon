// Todo: Build this to support session handling

var db   = require('../db/models');
var uuid = require('uuid');

var Session = function(token) {
    var self = this;
    
    self.token = '';
    self.data  = {};

    initialize(token);

    function initialize(token) {
    }
    
    self.token = function() { return token; }
    self.data  = function() { return data; } 
    
    self.generate_token = function() {
       return uuid.v4(); 
    };
    
    self.create_session = function() {
        
    };
    
    self.lookup_session = function(token) {
        
    };
    
    self.is_expired = function() {
        
    };
    
    self.expire_session = function() {
        
    };
    
    self.delete_session = function() {
        
    };
    
    self.set_kv = function(name, value) {
        
    };

    return self;
};

module.exports = ServerApp;

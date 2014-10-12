// Gate logic

var Module      = require('../module'),
    GateModel   = require('../../../db/models/gate'),
    _           = require('underscore');

var GateModule = function() {
    var self = new Module();
    
    // Load from obj
    function loadMe__meta() {
        return {
            'model' : {
                'required' : true
            },
        };
    }
    
    self.loadMe = function(args, callback) {
        var check = self.validate(loadMe__meta(), args);
        if(! check.is_valid) throw check.errors();
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        self.model = args.model;
        
        callback(self);
        
        return self;
    };

    // Find
    function findMe__meta() {
        return {
            'id' : {
                'requiredIfNot' : [ 'source' ]
            },
            'source' : {
                'requiredIfNot' : [ 'id' ]
            },
            'direction' : {
                'requiredIfNot' : [ 'id' ]
            }
        };
    }

    self.findMe = function(args, callback) {
        var check = self.validate(findMe__meta(), args);
        if(! check.is_valid) throw check.errors();
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        if(args.id) {
            GateModel.findById(args.id, function(err, doc) {
                
                if(err) {
                    callback(null);
                    return;
                }
                
                if(! doc) {
                    callback(null);
                    return;
                }
                
                self.model = doc;
                
                callback(self);
            });
        }
        else {
            GateModel.findOne(args, function(err, doc) {
                
                if(err) {
                    callback(null);
                    return;
                }
                
                if(! doc) {
                    callback(null);
                    return;
                }
                
                self.model = doc;
                
                callback(self);
            });
        }
    };

    // Create
    function createMe__meta() {
        var dirs = _.union(self.coplanarDirections(), self.verticalDirections());
        
        return {
            'source' : {
                'required' : true
            },
            'destination' : {
                'required' : true
            },
            'direction' : {
                'required' : true,
                'enum'     : dirs
            },
        };
    }

    self.createMe = function(args, callback) {
        var check = self.validate(createMe__meta(), args);
        if(! check.is_valid) throw check.errors();

        callback = ('function' === typeof callback) ? callback : function() {};
        
        // Create new region model
        GateModel.create(_.pick(args, [
            'source',
            'destination',
            'direction'
        ]), function(err, doc) {
            if(err) {
                callback(null);
                return;
            }
            
            self.model = doc;

            callback(self);
        });
    };
    
    // Basic accessors
    self.id = function() {
        return self.model._id;
    };
    
    self.direction = function() {
        return self.model.direction;
    };
    
    self.source = function(callback) {
        return self.model.source;
    };
    
    self.destination = function(callback) {
        return self.model.destination;
    };
    
    // other methods
    
    function randomDirection__meta() {
        return {
            directionType: {
                required : true,
                enum     : [
                    'coplanar', // north, south, east, west, etc.
                    'vertical', // up, down
                    'any' // any of the above
                ]
            }
        };
    }
    
    self.randomDirection = function(args) {
        var check = self.validate(randomDirection__meta(), args);
        if(! check.is_valid) throw check.errors();

        var directions;
        
        switch(args.directionType) {
            case 'coplanar':
                directions = self.coplanarDirections();
                break;
            case 'vertical':
                directions = self.verticalDirections();
                break;
            case 'any':
                directions = _.union(self.coplanarDirections(), self.verticalDirections());
                break;
        }
        
        var dir = Math.floor(Math.random() * directions.length);
        
        return directions[dir];
    };
    
    self.coplanarDirections = function() {
        return [
            'north',
            'northeast',
            'east',
            'southeast',
            'south',
            'southwest',
            'west',
            'northwest'
        ];
    };
    
    self.verticalDirections = function() {
        return [
            'up',
            'down'
        ];
    };
    
    function oppositeDirection__meta() {
        var dirs = _.union(self.coplanarDirections(), self.verticalDirections());
        
        return {
            'direction' : {
                'required' : true,
                'enum'     : dirs
            }
        };
    }
    
    self.oppositeDirection = function(args) {
        var check = self.validate(oppositeDirection__meta(), args);
        if(! check.is_valid) throw check.errors();
        
        return (self.oppositeDirections())[args.direction];
    };
    
    self.oppositeDirections = function() {
        return {
            'north'     : 'south',
            'northeast' : 'southwest',
            'east'      : 'west',
            'southeast' : 'northwest',
            'south'     : 'north',
            'southwest' : 'northeast',
            'west'      : 'east',
            'northwest' : 'southeast',
            'up'        : 'down',
            'down'      : 'up'
        };
    };
    
    function translateDirection__meta() {
        return {
            'direction' : {
                'required' : true
            }
        };
    }
    
    self.translateDirection = function(args) {
        var check = self.validate(translateDirection__meta(), args);
        if(! check.is_valid) throw check.errors();
        
        var direction = String(args.direction).toLowerCase();
        
        return (self.directionTranslations())[direction];
    };
    
    self.directionTranslations = function() {
        return {
            'north'     : 'north',
            'n'         : 'north',
            'northeast' : 'northeast',
            'ne'        : 'northeast',
            'east'      : 'east',
            'e'         : 'east',
            'southeast' : 'southeast',
            'se'        : 'southeast',
            'south'     : 'south',
            's'         : 'south',
            'southwest' : 'southwest',
            'sw'        : 'southwest',
            'west'      : 'west',
            'w'         : 'west',
            'northwest' : 'northwest',
            'nw'        : 'northwest',
            'up'        : 'up',
            'u'         : 'up',
            'down'      : 'down',
            'd'         : 'down'
        };
    };
    
    return self;
};

module.exports = GateModule;

// Place logic

var Module     = require('../module'),
    PlaceModel = require('../../../db/models/place'),
    Plot       = require('./plot'),
    _          = require('underscore');

var PlaceModule = function() {
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
        
        self.plot = new (new Plot().typeMap(self.model.type))();
        
        callback(self);
        
        return self;
    };

    // Find
    function findMe__meta() {
        return {
            'id' : {
                'required' : true
            }
        };
    }

    self.findMe = function(args, callback) {
        var check = self.validate(findMe__meta(), args);
        if(! check.is_valid) throw check.errors();
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        PlaceModel.findById(args.id, function(err, doc) {
            
            if(err) {
                callback(null);
                return;
            }
            
            if(! doc) {
                callback(null);
                return;
            }
            
            self.model = doc;
            
            self.plot = new (new Plot().typeMap(doc.type))();
            
            callback(self);
        });
    };

    // Create
    function createMe__meta() {
        return {
            'type' : {
                'required' : true,
                'type'     : 'string'
            },
            'is_spawn_point' : {
                'desc' : 'Flag to determine if this place should be created as a potential spawn point',
                'type'  : 'boolean'
            },
            'is_area_gate' : {
                'desc' : 'Flag to determine if this place can have a gate to another area',
                'type'  : 'boolean'
            }
        };
    }

    self.createMe = function(args, callback) {
        var check = self.validate(createMe__meta(), args);
        if(! check.is_valid) throw check.errors();

        callback = ('function' === typeof callback) ? callback : function() {};
        
        // Create new region model
        PlaceModel.create(_.pick(args, [
            'type',
            'is_spawn_point',
            'is_area_gate'
        ]), function(err, doc) {
            if(err) {
                callback(null);
                return;
            }
            
            self.model = doc;

            self.plot = new (new Plot().typeMap(doc.type))();

            callback(self);
        });
    };
    
    // Basic accessors
    self.id = function() {
        return self.model._id;
    };
    
    // Other methods
    self.addCharacter = function(character, callback) {
        // Add a character to this place
        var id = (character.model) ? (character.model.id || character.model._id) : (character.id || character._id);
        if(! id) throw "No place id found!";
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        self.model.characters.push(id);
        self.model.save(function(err) {
            if(err) throw err;
            
            callback();
        });
    };
    
    self.removeCharacter = function(character, callback) {
        // Remove a character from this place
        var id = (character.model) ? (character.model.id || character.model._id) : (character.id || character._id);
        if(! id) throw "No place id found!";
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        self.model.characters.pull(id);
        self.model.save(function(err) {
            if(err) throw err;
            
            callback();
        });
    };
    
    self.addGate = function(gate, callback) {
        // Add a gate to this place
        var id = (gate.model) ? (gate.model.id || gate.model._id) : (gate.id || gate._id);
        if(! id) throw "No gate id found!";
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        self.model.gates.push(id);
        self.model.save(function(err) {
            if(err) throw err;
            
            callback();
        });
    };
    
    self.removeGate = function(gate, callback) {
        // Remove a gate from this place
        var id = (gate.model) ? (gate.model.id || gate.model._id) : (gate.id || gate._id);
        if(! id) throw "No gate id found!";
        
        callback = ('function' === typeof callback) ? callback : function() {};
        
        self.model.gates.pull(id);
        self.model.save(function(err) {
            if(err) throw err;
            
            callback();
        });
    };
    
    // Summary of what is in this place
    self.summary = function() {
        var output = '';
        
        output = output + self.plot.getName() + "{{ br() }}{{ br () }}";
        output = output + self.plot.getDescription();
        
        return output;
    };

    return self;
};

module.exports = PlaceModule;

// Place logic

var Module     = require('../module'),
    PlaceModel = require('../../../db/models/place'),
    Plot       = require('./plot'),
    _          = require('underscore');

var PlaceModule = function(args) {
    var self = new Module();

    function findMe__meta() {
        return {
            'id' : {
                'required' : true,
            }
        };
    }

    self.findMe = function(args, callback) {
        var check = self.validate(findMe__meta(), args);
        if(! check.is_valid) throw check.errors();
        
        PlaceModel.findById(args.id, function(err, doc) {
            if(err) throw err;
            
            if(! doc) throw "Place not found!";
            
            self.model = doc;
            
            self.plot = new (new Plot().typeMap(doc.type))();
            
            if('function' === typeof callback) callback(self);
        });
    };

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
        if(args.options) _.extend(args,args.options);

        var check = self.validate(createMe__meta(), args);
        if(! check.is_valid) throw check.errors();

        // Create new region model
        PlaceModel.create(_.pick(args, [
            'type',
            'is_spawn_point',
            'is_area_gate'
        ]), function(err, doc) {
            if(err) throw err;
            
            self.model = doc;

            self.plot = new (new Plot().typeMap(doc.type))();

            if('function' === typeof callback) callback(self);
        });
    };
    
    self.addCharacter = function(character, callback) {
        // Add a character to this place
        var id = (character.model) ? character.model.id : character.id;
        if(! id) throw "No place id found!";
        
        self.model.characters.push(id);
        self.model.save(function(err) {
            if(err) throw err;
            
            if('function' === typeof callback) callback();
        });
    };
    
    self.removeCharacter = function(character, callback) {
        // Add a character to this place
        var id = (character.model) ? character.model.id : character.id;
        if(! id) throw "No place id found!";
        
        self.model.characters.pull(id);
        self.model.save(function(err) {
            if(err) throw err;
            
            if('function' === typeof callback) callback();
        });
    };
    
    // Summary of what is in this place
    self.summary = function() {
        var output = '';
        
        output = output + self.plot.name + "{{ br() }}{{ br () }}";
        output = output + self.plot.shortDescription + "{{ br() }}{{ br () }}";
        
        return output;
    };

    return self;
};

module.exports = PlaceModule;

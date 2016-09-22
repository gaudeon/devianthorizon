// Region logic

var Module       = require('../module'),
    _            = require('underscore'),
    mongoose     = require('mongoose'),
    ObjectId     = mongoose.Types.ObjectId,
    RegionModel  = require('../../../db/models/region'),
    PlaceModel   = require('../../../db/models/place'),
    PlaceModule  = require('./place'),
    Biome        = require('./biome');

var RegionModule = function(args) {
    'use strict';
    
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

        RegionModel.findById(args.id, function(err, doc) {
            if(err) throw err;
            
            if(! doc) throw "Region not found!";
            
            self.model = doc;
            
            self.biome = new (new Biome().typeMap(doc.type))();
            
            if('function' === typeof callback) callback(self);
        });
    };

    function createMe__meta() {
        return {
            'type' : {
                'required' : true,
                'type'     : 'string'
            }
        };
    }

    self.createMe = function(args, callback) {
        if(args.options) _.extend(args,args.options);

        var check = self.validate(createMe__meta(), args);
        if(! check.is_valid) throw check.errors();

        // Create new region model
        RegionModel.create(_.pick(args, [
            'type'
        ]), function(err, doc) {
            if(err) throw err;
            self.model = doc;

            self.biome = new (new Biome().typeMap(doc.type))();

            if('function' === typeof callback) callback(self);
        });
    };

    self.addPlace = function(place) {
        // Add a place to this region
        var id = (place.model) ? (place.model.id || place.model._id) : (place.id || place._id);
        if(! id) throw "No place id found!";

        self.model.places.push(place.model.id);
        self.model.save(function(err) {
            if(err) throw err;
        });
    };
    
    self.findSpawnPoints = function(callback) {
        callback = ('function' === typeof callback) ? callback : function() {};
        
        var $in = [];
        for(var i = 0; i < self.model.places.length; i++) {
            $in.push( new ObjectId( self.model.places[i] ) );
        }
        
        PlaceModel.find({ "_id" : { "$in" : $in } }, function(err, docs) {
            var places = [];
            
            for(var d = 0; d < docs.length; d++) {
                places.push( new PlaceModule().loadMe( { model : docs[d] } ) );
            }
            
            callback(places);
        });
    };

    // map types to biome objects
    self.biome_map = function() {
        return {
            'village' : VillageBiome
        };
    };

    return self;
};

module.exports = RegionModule;

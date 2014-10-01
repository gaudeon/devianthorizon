// Region logic

var Module       = require('../module'),
    _            = require('underscore'),
    RegionModel  = require('../../../db/models/region'),
    PlaceModule  = require('./place'),
    Biome        = require('./biome');

var RegionModule = function(args) {
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
        var id = (place.model) ? place.model.id : place.id;
        if(! id) throw "No place id found!";

        self.model.places.push(place.model.id);
        self.model.save(function(err) {
            if(err) throw err;
        });
    };
    
    self.findSpawnPoints = function(callback) {
        PlaceModel.find({ id: self.model.places }, 'id', function(err, docs) {
            var places = [];
            
            function loadPlaces(cb) {
                var p = docs.shift;
                if(!p) {
                    if('function' === typeof cb) cb(places);
                    return;
                }
                
                new PlaceModule().findMe({ id: p.id }, function(place) {
                    places.push(place);
                    loadPlaces(cb);
                });
            }
            
            loadPlaces(function() {
                callback(places);
            });
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

// World management

var Module       = require('../module'),
    VillageBiome = require('./biome/village'),
    Models       = require('../../../db/models'),
    RegionModule = require('./region'),
    PlaceModule  = require('./place'),
    _            = require('underscore');

var WorldModule = function() {
    var self = new Module();

    initialize();

    function initialize() {
    }

    // Find spawn point
    self.findSpawnPoint = function(callback) {
        Models.place.findOne({ is_spawn_point: true }, 'id', function(err, doc) {
            if(!doc) {
                initWorld(function(region) {
                    region.findSpawnPoints(function(list) {
                        callback(list.shift);
                    });
                });
            }
            else {
                new PlaceModule().findMe({ id: doc.id }, function(place) {
                    callback(place);
                });
            }
        });
    };

    // Generate - Create biome(s) based on predefined rules
    self.generate = function() {
    };
    
    // Called whenever a new place is entered
    self.enterPlace = function(character, place, callback) {
        var id = (place.model) ? place.model.id : place.id;
        if(! id) throw "No place id found!";
        
        new PlaceModule().findMe({ id: id }, function(place) {
            var output = place.summary();
            
            if('function' === typeof callback) callback({
                character : character,
                place     : place,
                output    : output
            });
        });
    };
    
    function initWorld(callback) {
        // Using the village biome as that is all we have right now
        var villageBiome = new VillageBiome();

        var regionData= villageBiome.generate();

        // Create a new region
        new RegionModule().createMe(_.pick(regionData, [
            'type'
        ]), function(region) {
            
            // recursion to wait until all places are created before calling the callback
            function createPlaces(callback) {
                var p = regionData.plots.shift();
                if(! p) {
                    if('function' === typeof callback) callback();
                    return;
                }
                
                new PlaceModule().createMe(p, function(placeObj) {
                    region.addPlace(placeObj);
                    createPlaces(callback);
                });
            }
            
            createPlaces(function() {
                callback(region);
            });
        });
    }

    return self;
};

module.exports = WorldModule;

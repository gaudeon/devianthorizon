// World management

var Module       = require('../module'),
    VillageBiome = require('./biome/village'),
    RegionModule = require('./region'),
    PlaceModule  = require('./place'),
    _            = require('underscore');

var WorldModule = function() {
    var self = new Module();

    initialize();

    function initialize() {
    }

    // Find spawn point
    self.findSpawnPoint = function() {

    };

    // Generate - Create biome(s) based on predefined rules
    self.generate = function() {
        // Testing biome generation
        var villageBiome = new VillageBiome();

        var region = villageBiome.generate();

        // Create a new region
        new RegionModule().createMe(_.pick(region, [
            'type'
        ]), function(regionObj) {

            // for each plot, add to region
            _.each(region.plots, function(p) {

                new PlaceModule().createMe(p, function(placeObj) {
                    regionObj.addPlace(placeObj);
                });

            });

        });

        return region;
    };

    return self;
};

module.exports = WorldModule;

// World management

var Module       = require('../module'),
    VillageBiome = require('./biome/village');

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
        
        return villageBiome.generate();
    };

    return self;
};

module.exports = WorldModule;

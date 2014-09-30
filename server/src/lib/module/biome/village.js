// Village Biome

var Biome = require('../biome');
    
var VillageBiome = function() {
    var self = new Biome();

    initialize();

    function initialize() {
        self.type = 'village';
        
        self.schemaRule({
            rule: 'plot_count_modifier',
            value: 0
        });
        
        self.schemaPlot({
            type           : 'dirt_road',
            is_required    : true,
            is_spawn_point : true
        });
    }

    return self;
};

module.exports = VillageBiome;

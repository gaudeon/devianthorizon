// Village Biome

var Biome = require('../biome');

var VillageBiome = function(options) {
    var self = new Biome();

    initialize();

    function initialize() {
        self.type = 'village';

        self.mergeOptions(options); // merge options

        self.buildRule({
            rule: 'plot_count_modifier',
            value: 0
        });

        self.buildPlot({
            type           : 'dirt_road',
            is_required    : true,
            is_spawn_point : true,
            is_area_gate   : true
        });
    }

    return self;
};

module.exports = VillageBiome;

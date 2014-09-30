// Dirt Road Plot

var Plot = require('../plot');

var DirtRoadPlot = function(options) {
    var self = new Plot();

    initialize();

    function initialize() {
        self.type = 'dirt_road';

        self.mergeOptions(options); // merge options
    }

    return self;
};

module.exports = DirtRoadPlot;

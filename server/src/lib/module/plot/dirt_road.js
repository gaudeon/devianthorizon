// Dirt Road Plot

var Plot = require('../plot');

var DirtRoadPlot = function() {
    var self = new Plot();

    initialize();

    function initialize() {
        self.type = 'dirt_road';
    }

    return self;
};

module.exports = DirtRoadPlot;

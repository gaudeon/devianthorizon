// Dirt Road Plot

var Plot = require('../plot'),
    Data = require('../../data/plot/dirt_road'),
    _    = require('underscore');

var DirtRoadPlot = function() {
    var self = new Plot();

    initialize();

    function initialize() {
        self.type = 'dirt_road';
        
        _.extend(self, Data);
    }
    
    return self;
};

module.exports = DirtRoadPlot;

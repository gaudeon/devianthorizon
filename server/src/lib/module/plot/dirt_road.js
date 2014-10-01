// Dirt Road Plot

var Plot = require('../plot');

var DirtRoadPlot = function(options) {
    var self = new Plot();

    initialize();

    function initialize() {
        self.type = 'dirt_road';
        
        self.name = names()[ Math.floor( Math.random() * names().length ) ];
        
        self.shortDescription = shortDescriptions()[ Math.floor( Math.random() * shortDescriptions().length ) ];

        self.mergeOptions(options); // merge options
    }
    
    function names() {
        return [
            'Dirt Road',
        ];
    }
    
    function shortDescriptions() {
        return [
            'The road you are upon is made of well-trod dirt.',
            'The stretch of dirt road before you is barren and dusty.',
        ];
    }

    return self;
};

module.exports = DirtRoadPlot;

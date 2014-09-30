// Plot logic

var Module = require('../module');

var PlotModule = function() {
    var self = new Module();

    initialize();

    function initialize() {
        self.type = 'undefined'; // Each plot must overwrite this to be their type, their type needs to be the same name as their file name
    }
    
    // create a plot that can then be added as a place
    self.generate = function() {
        
    };

    return self;
};

module.exports = PlotModule;

// Plot logic

var Module = require('../module'),
    _      = require('underscore');

var PlotModule = function(options) {
    'use strict';
    
    var self = new Module();

    var type_map; // private variable used by self.typeMap

    initialize();

    function initialize() {
        self.type = 'undefined'; // Each plot must overwrite this to be their type, their type needs to be the same name as their file name
        
        self.name = 'undefined'; // Each plot must overwrite this to be their descriptive name (usually in their data file)
        
        self.description = []; // Each plot may or may not overwrite this (usually in their data file)
        
        _.extend(self, options);
    }
    
    self.getName = function() { return self.name; };
    
    self.getDescription = function() {
        if(! self.selected_description) {
            self.selected_description = self.description[ Math.floor( Math.random() * (self.description.length - 1) ) ];
        }
        
        return self.selected_description;
    };

    // map types to plot objects
    self.typeMap = function(type) {
        if(! type_map) {
            type_map = {
                'dirt_road' : require('./plot/dirt_road')
            };
        }

        if(type) return type_map[type];
        return type_map;
    };

    return self;
};

module.exports = PlotModule;

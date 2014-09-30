// Biome logic



var Module = require('../module'),
    _      = require('underscore');
    
var BiomeModule = function() {
    var self = new Module();
    
    initialize();

    function initialize() {
        self.type   = 'undefined'; // Each biome must overwrite this to be their type, their type needs to be the same name as their file name
        self.schema = {
            rules : { },
            plots : [ ]
        };  // The rules and flags neccessary to build a biome, use the schema functions to build this out
        
        // Plot Map
        self.plot_map = {};
        self.plot_map.dirt_road = require('./plot/dirt_road');
    }
    
    // create a map of plots that can then be added as a region with places
    self.generate = function() {
        var region = {
            plots : []
        };
        
        var num_plots = Math.floor((Math.random() * (self.maximumGeneratedPlots() - self.minimumGeneratedPlots()))) + self.minimumGeneratedPlots();

        // First add the required plots
        _.each(self.schema.plots, function(p) {
            if(p.is_required) {
                region.plots.push( new self.plot_map[p.type]() );
                num_plots--;
            }
        });
        
        // Then add the rest
        var schema_plot_count = self.schema.plots.length;
        
        for(var i = 0; i < num_plots; i++) {
            var p = self.schema.plots[ Math.floor(Math.random() * schema_plot_count) ];
            region.plots.push( new self.plot_map[p.type]() );
        }
        
        return region;
    };
    
    self.minimumGeneratedPlots = function() {
        var min = 0;
        
        _.each(self.schema.plots, function(p) { if(p.is_required) min++; });
        
        if(min < 1) min = 1;
        
        return min;
    };
    
    self.maximumGeneratedPlots = function() {
        return self.minimumGeneratedPlots() + (self.schema.plot_count_modifier || 0);
    };
    
    // Add or set a schema rule
    self.schemaRule__meta = function() {
        return {
            'rule' : {
                'required' : true,
                'enum'     : [
                    /* plot_count_modifier
                     *      set this value to increate the range of plots.
                     *          Min Plots = # of Plots flagged required or one (1).
                     *          Max Plots = Min Plots + Plot Count Modifier
                     */
                    'plot_count_modifier' 
                ]
            },
            'value' : {
                'required' : true,
            }
        };
    };
    
    self.schemaRule = function(args) {
        var check = self.validate(self.schemaRule__meta(), args);
        
        if(check.is_valid) {
            self.schema.rules[ args.rule ] = args.value;
        }
        else {
            throw check.errors();
        }
    };
    
    // Add a plot
    self.schemaPlot__meta = function() {
        return {
            'type' : {
                'desc'     : 'The plot type',
                'required' : true,
                'enum'     : [
                    // The list of all plot types
                    'dirt_road'
                ]
            },
            'is_required' : {
                'desc' : 'Flag to determine if this is required when generating the region from this biome'  
            },
            'is_spawn_point' : {
                'desc' : 'Flag to determine if this plot should be created as a potential spawn point'
            }
        };
    };
    
    self.schemaPlot = function(args) {
        var check = self.validate(self.schemaPlot__meta(), args);
        
        if(check.is_valid) {
            self.schema.plots.push(args);
        }
        else {
            throw check.errors();
        }
    };

    return self;
};

module.exports = BiomeModule;

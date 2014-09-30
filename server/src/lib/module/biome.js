// Biome logic

var Module = require('../module'),
    _      = require('underscore'),
    Plot   = require('./plot');

var BiomeModule = function(options) {
    var self = new Module();

    var type_map; // private variable used by self.typeMap

    initialize();

    function initialize(options) {
        self.type   = 'undefined'; // Each biome must overwrite this to be their type, their type needs to be the same name as their file name

        self.mergeOptions(options); // merge options

        // The rules and flags neccessary to build a biome, use the schema functions to build this out
        self.build = {
            rules : { },
            plots : [ ]
        };

        // Plot Map - used to create plot objects when generate is called
        self.plot_map = new Plot().typeMap();
    }

    // create a map of plots that can then be added as a region with places
    self.generate = function() {
        var region = {
            type  : self.type,
            plots : []
        };

        // Clone out build so we can keep it intact for future generate calls
        var build = _.clone(self.build);

        var num_plots = Math.floor((Math.random() * (self.maximumGeneratedPlots() - self.minimumGeneratedPlots()))) + self.minimumGeneratedPlots();

        // First add the required plots
        _.each(build.plots, function(p) {
            if(p.is_required) {
                for(var i = p.spawned; i < p.spawn_minimum; i++) { // spawn x number of required plots
                    var opt = _.pick(p,placeOptions());
                    region.plots.push( new self.plot_map[p.type](opt) );
                    p.spawned++;
                    num_plots--;
                }
            }
        });

        // Then add the rest
        var schema_plot_count = build.plots.length;

        var continue_loop = num_plots * 100;

        while(num_plots > 0 && continue_loop > 0) {
            var p = build.plots[ Math.floor(Math.random() * schema_plot_count) ];

            // Don't spawn unless we haven't reached the maximum
            if(p.spawn_maximum == 0 || p.spawned < p.spawn_maximum) {
                var opt = _.pick(p,placeOptions());
                region.plots.push( new self.plot_map[p.type](opt) );
                p.spawned++;
                num_plots--;
            }

            // Decrease continue loop every time, this helps prevent an infinite loop if all plots have reached their spawn_maximum
            continue_loop--;
        }

        return region;
    };

    self.minimumGeneratedPlots = function() {
        var min = 0;

        _.each(self.build.plots, function(p) { if(p.is_required) min = min + p.spawn_minimum; });

        if(min < 1) min = 1;

        return min;
    };

    self.maximumGeneratedPlots = function() {
        return self.minimumGeneratedPlots() + (self.build.plot_count_modifier || 0);
    };

    // Add or set a schema rule
    function buildRule__meta() {
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
    }

    self.buildRule = function(args) {
        var check = self.validate(buildRule__meta(), args);

        if(check.is_valid) {
            self.build.rules[ args.rule ] = args.value;
        }
        else {
            throw check.errors();
        }
    };

    // Add a plot
    function buildPlot__meta() {
        return {
            'type' : {
                'desc'     : 'The plot type',
                'required' : true,
                'enum'     : [
                    // The list of all plot types
                    'dirt_road'
                ]
            },
            'spawn_minimum' : {
                'desc' : 'Minimum number of plots of this type that can be spawned. Defaults to 0 (no minimum)',
                'type' : 'number'
            },
            'spawn_maximum' : {
                'desc' : 'Maximum number of plots of this type that can be spawned. Defaults to 0 (no maximum). This is really only useful when the plot is required.',
                'type' : 'number'
            },
            'is_required' : {
                'desc' : 'Flag to determine if this is required when generating the region from this biome',
                'type'  : 'boolean'
            },
            'is_spawn_point' : {
                'desc' : 'Flag to determine if this plot should be created as a potential spawn point',
                'type'  : 'boolean'
            },
            'is_area_gate' : {
                'desc' : 'Flag to determine if this plot can have a gate to another area',
                'type'  : 'boolean'
            }
        };
    }

    self.buildPlot = function(args) {
        var check = self.validate(buildPlot__meta(), args);

        // Misc. Flags
        if(! _.has(args, 'is_required'))    _.extend(args, {is_required: false});
        if(! _.has(args, 'is_spawn_point')) _.extend(args, {is_spawn_point: false});
        if(! _.has(args, 'is_area_gate'))   _.extend(args, {is_area_gate: false});

        // Plot spawning, minimum and maximums
        if(! _.has(args, 'spawn_minimum')) _.extend(args, {spawn_minimum: 0});
        if(! _.has(args, 'spawn_maximum')) _.extend(args, {spawn_maximum: 0});
        _.extend(args, {spawned: 0}); // used to track how many are spawned during a generate call

        if(args.is_required && args.spawn_minimum < 1) args.spawn_minimum = 1; // make sure we are ane when we require a plot
        if(args.spawn_maximum > 0 && args.spawn_maximum < args.spawn_minimum) args.spawn_maximum = args.spawn_minimum; // make sure we are sane when we have a maximum

        if(check.is_valid) {
            self.build.plots.push(args);
        }
        else {
            throw check.errors();
        }
    };

    // placeOptions - attributes from buildPlot that should be transfered over to a place object
    function placeOptions() {
        return [
            'is_spawn_point',
            'is_area_gate'
        ];
    }

    // buildOptions - attributes from buildPlot that are build only
    function buildOptions() {
        return [
            'spawn_minimum',
            'spawn_maximum',
            'is_required'
        ];
    }

    // map types to biome objects
    self.typeMap = function(type) {
        if(! type_map) {
            type_map = {
                'village' : require('./biome/village')
            };
        }

        if(type) return type_map[type];
        return type_map;
    };

    return self;
};

module.exports = BiomeModule;

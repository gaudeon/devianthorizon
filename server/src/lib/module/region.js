// Region logic

var Module       = require('../module'),
    _            = require('underscore'),
    RegionModel  = require('../../../db/models/region'),
    Biome        = require('./biome');

var RegionModule = function(args) {
    var self = new Module();

    function findMe__meta() {
        return {
            'id' : {
                'required' : true,
            }
        };
    }

    self.findMe = function(args, callback) {
        var check = self.validate(findMe__meta(), args);
        if(! check.is_valid) throw check.errors();

        // TODO: Get existing region model
    };

    function createMe__meta() {
        return {
            'type' : {
                'required' : true,
                'type'     : 'string'
            }
        };
    }

    self.createMe = function(args, callback) {
        if(args.options) _.extend(args,args.options);

        var check = self.validate(createMe__meta(), args);
        if(! check.is_valid) throw check.errors();

        // Create new region model
        RegionModel.create(_.pick(args, [
            'type'
        ]), function(err, doc) {
            if(err) throw err;
            self.model = doc;

            self.biome = new (new Biome().typeMap(doc.type))();

            if('function' === typeof callback) callback(self);
        });
    };

    self.addPlace = function(placeObj) {
        // Add a place to this region
        if(! placeObj.model || ! placeObj.model.id) throw "No place id found!";

        self.model.places.push(placeObj.model.id);
        self.model.save(function(err) {
            if(err) throw err;
        });
    };

    // map types to biome objects
    self.biome_map = function() {
        return {
            'village' : VillageBiome
        };
    };

    return self;
};

module.exports = RegionModule;

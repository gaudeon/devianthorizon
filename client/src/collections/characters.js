// Characters collection

var Character = require('../models/character');

module.exports = (function() {
    'use strict';
    
    return Backbone.Collection.extend({
        model: Character
    });
})();


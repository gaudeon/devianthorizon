// Characters collection

var Character = require('../models/character');

var Characters = Backbone.Collection.extend({
  model: Character
});

module.exports = Characters;
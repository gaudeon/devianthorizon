// Model for the character

var CharacterModel = Backbone.Model.extend({
    defaults: {
        full_name  : '',
        created    : Date.now(),
    }
});

module.exports = CharacterModel;
// The character view

// TODO: Make the play button work

var CharacterView = Backbone.Marionette.ItemView.extend({
    template: require('../../templates/character.html'),
    
    className: 'character',

    events: {
    },
    
});

module.exports = CharacterView;
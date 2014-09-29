// The lobby view

var Characters    = require('../collections/characters'),
    CharacterView = require('./character');

var LobbyView = Backbone.Marionette.CompositeView.extend({
    template: require('../../templates/lobby.html'),
    
    collection: new Characters(),
    
    childView: CharacterView,

    events: {
    }
});

module.exports = LobbyView;
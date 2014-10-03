// The lobby view

var Characters    = require('../collections/characters'),
    CharacterView = require('./character');

var LobbyView = Backbone.Marionette.CompositeView.extend({
    template: require('../../templates/lobby.html'),
    
    className: 'lobby',
    
    collection: new Characters(),
    
    childView: CharacterView,

    events: {
        'click .play_as_character' : 'joinWorld'
    },
    
    joinWorld: function(ev) {
        ev.preventDefault();
        
        var radio = Backbone.Wreqr.radio.channel('global');
        
        radio.vent.trigger('joinWorld', {
            character : $(ev.target).data('id')
        }, function(resp) {
            // Do nothing, navigation should change to game...
        });
        
    }
    
});

module.exports = LobbyView;
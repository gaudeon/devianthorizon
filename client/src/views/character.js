// The character view

module.exports = (function() {
    'use strict';
    
    return Backbone.Marionette.ItemView.extend({
        template: require('../../templates/character.html'),
        
        className: 'character',
    
        events: {
        },
        
    });
})();

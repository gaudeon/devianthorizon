// Model for the character

module.exports = (function() {
    'use strict';
    
    return Backbone.Model.extend({
        defaults: {
            full_name  : '',
            created    : Date.now(),
        }
    });
})();


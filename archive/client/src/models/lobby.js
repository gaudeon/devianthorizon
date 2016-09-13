// Model for the lobby view

module.exports = (function() {
    'use strict';
   
    return Backbone.Model.extend({
        defaults: {
            id         : '',
            first_name : '',
            last_name  : '',
            email      : '',
            username   : '',
            created    : ''
        }
    });
})();

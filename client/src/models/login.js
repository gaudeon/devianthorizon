// Model for the login view

module.exports = (function() {
    'use strict';
    
    return Backbone.Model.extend({
        defaults: {
            login_error : '',
            password    : '',
            username    : ''
        }
    });
})();


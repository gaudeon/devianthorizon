// Model for the create character view

module.exports = (function() {
    'use strict';
    
    return Backbone.Model.extend({
        defaults: {
            full_name       : '',
            full_name_error : '',
            general_error   : '',
        },
        validate: function(data, options) {
            var self = this;
            var err = '';
            
            // Requirement checking
            _.each(['full_name'], function(k) {
                // Clear current error
                var _key = k + '_error'; 
                self.set(_key,  '');
                    
                if(_.has(data, k) && data[k] === '') {
                    var label = '';
                    _.each(k.split(/_/), function(t) {
                        t.match(/^(.)/);
                        t = t.replace(/^(.)/, RegExp.$1.toUpperCase());
                        label = label + ((label !== '') ? ' ' : '') + t;
                    });
                    var _val = label + ' is required.';
                    err = err + ((err !== '') ? ' ' : '') + _val;
                    self.set(_key,  _val);
                }
            });
            
            self.set(data); // Still set the data so the form keeps it
            
            return (err !== '') ? err : false;
        }
    });
})();


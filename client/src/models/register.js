// Model for the register view

module.exports = (function() {
    'use strict';
    
    return Backbone.Model.extend({
        defaults: {
            first_name        : '',
            last_name         : '',
            email            : '',
            username         : '',
            password         : '',
            confirm_password : '',
           
            // Error messages 
            first_name_error  : '',
            last_name_error   : '',
            email_error      : '',
            username_error   : '',
            password_error   : '',
            register_error   : ''
        },
        validate: function(data, options) {
            var self = this;
            var err = '';
            
            // Requirement checking
            _.each(['first_name', 'last_name', 'email', 'username', 'password', 'confirm_password'], function(k) {
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
            
            // check that password and confirm password match
            if(_.has(data, 'password') && data.password != (data.confirm_password || '')) {
                var _val = 'Password and Confirm Password do not match.';
                self.set('password_error', _val);
                err = err + ((err !== '') ? ' ' : '') + _val;
            }
            
            self.set(data); // Still set the data so the form keeps it
            
            return (err !== '') ? err : false;
        }
    });
})();

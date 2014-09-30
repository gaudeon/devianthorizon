// Basic Module

var _  = require('underscore');

var Module = function() {
    var self = this;

    // Used to provide validation to methods
    self.validate = function(meta, data) {
        var result = (function () {
            var self = this;
            
            self.is_valid = true;
            
            self.errors = function() {
                var str = '';
                _.each(
                    _.filter(
                        _.keys(self),
                        function(k) { var patt = /_error$/i; return patt.test(k); }
                    ),
                    function(k) { str = str + ' ' + self[k] }
                );
                return str;
            };
            
            return self;
        })();
        
        _.each(_.keys(meta), function(attr) {
            var name = attr;
            name = name.charAt(0).toUpperCase() + name.substr(1);
            
            var cond = meta[attr];
            
            var ek = attr + '_error';
            
            _.each(_.keys(cond), function(cond_type) {
                if(_.has(result, ek)) return;
                
                if(cond_type == 'required' && cond[cond_type] && ! _.has(data, attr)) {
                    result.is_valid = false;
                    result[ek] = name + ' is required.';
                    return;
                }
                
                if(cond_type == 'enum' && ! _.contains(cond[cond_type], data[attr]) ) {
                    result.is_valid = false;
                    result[ek] = name + ' was not found in list of acceptable values.';
                    return;
                }
            });
            
        });
        
        return result;
    };

    return self;
};

module.exports = Module;

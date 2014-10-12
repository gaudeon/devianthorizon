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
                    function(k) { str = str + ' ' + self[k]; }
                );
                return str;
            };

            return self;
        })();

        _.each(_.keys(meta), function(attr) {
            var name = attr;
            name = name.charAt(0).toUpperCase() + name.substr(1);
            name.replace('_', ' ');

            var cond = meta[attr];

            var ek = attr + '_error';

            _.each(_.keys(cond), function(cond_type) {
                if(_.has(result, ek)) return;

                if(cond_type === 'required' && cond[cond_type] && ! _.has(data, attr)) {
                    result.is_valid = false;
                    result[ek] = name + ' is required.';
                    return;
                }
                
                // setup an attribute to be require if one other attributes in the provided array are present in the args
                // example: 'attr': { 'requireIf' : ['attr1', 'attr2'] }
                if(cond_type === 'requiredIf' && _.intersection(_.keys(data), cond[cond_type]).length !== 0 && ! _.has(data, attr)) {
                    result.is_valid = false;
                    result[ek] = name + ' is required.';
                    return;
                }
                
                // setup an attribute to be required if no other attributes in the provided array are present in the args
                // example: 'attr': { 'requiredIfNot' : ['attr1', 'attr2'] }
                if(cond_type === 'requiredIfNot' && _.intersection(_.keys(data), cond[cond_type]).length === 0 && ! _.has(data, attr)) {
                    result.is_valid = false;
                    result[ek] = name + ' is required.';
                    return;
                }

                if(! _.has(data, attr)) return; // If not required and not passed no need to validate further

                if(cond_type === 'enum' && ! _.contains(cond[cond_type], data[attr]) ) {
                    result.is_valid = false;
                    result[ek] = name + ' was not found in list of acceptable values.';
                    return;
                }

                if(cond_type === 'type') {
                    if(_.contains(['undefined','object','boolean','number','string','symbol','function'],cond[cond_type]) && cond[cond_type] !== typeof(data[attr])) {
                        result.is_valid = false;
                        result[ek] = name + ' is not a ' + cond[cond_type] + '.';
                        return;
                    }
                }
            });

        });

        return result;
    };

    return self;
};

module.exports = Module;

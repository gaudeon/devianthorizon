// Miscellaneous utility functions

var Module = require('../module');

var UtilsModule = function() {
    'use strict';
    
    var self = new Module();

    function soundex__meta() {
        return {
            'string' : {
                'required' : true,
                'type'     : 'string'
            },
        };
    }
    
    self.soundex = function(args) {
        var check = self.validate(soundex__meta(), args);
        if(! check.is_valid) throw check.errors();

        args.string = args.string.toUpperCase();

        var payload = {
            'soundex': '',
            'digits' : [],
            'string' : args.string,
            'chars'  : args.string.split('')
        };

        // convert characters
        for(var i = 0; i < payload.chars.length; i++) {
            payload.digits.push( self.soundex_value( payload.chars[i] ) );
        }

        // process digits
        var dlen = payload.digits.length; 
        for(var d = 0; d < dlen; d++) {
            var current = payload.digits[d];
            var next_1  = payload.digits[d + 1];
            var next_2  = payload.digits[d + 2]; 

            if(! next_1)
                continue;

            // like digits get combined
            if(current === next_1) {
                payload.digits.splice(d,1);
                d--;
                dlen--;
                continue;
            }

            if(! next_2)
                continue;

            // like digits across 'h' and 'w' get combined
            if(next_1 < 0 && current === next_2) {
                payload.digits.splice(d,2);
                d = d - 2;
                dlen = dlen - 2;
                continue;
            }
        }

        // build soundex 
        payload.digits.splice(0,1); // Remove the first digit (since that is a letter)
        payload.soundex = payload.chars[0];

        for(var s = 0; s < payload.digits.length; s++) {
            if(payload.soundex.length > 3) // leave loop if we have our soundex
                break; 

            if(payload.digits[s] < 1) // next digit if this one isn't legit
                continue;

            payload.soundex = payload.soundex + payload.digits[s]; // append a digit
        }

        // fill in zeros at the end if necessary 
        var remaining = 4 - payload.soundex.length;
        for(var p = 0; p < remaining; p++) {
            payload.soundex = payload.soundex + '0';
        }

        return payload.soundex;
    };

    self.soundex_value = function(chr) {
        if('string' !== typeof chr) return 0;
        if(chr.length != 1) return 0;
        var val = self.soundex_value_hash()[chr]; 
        return val ? val : 0;
    };

    self.soundex_value_hash = function() {
        return {
            'B': 1,
            'F': 1,
            'P': 1,
            'V': 1,
            'C': 2,
            'G': 2,
            'J': 2,
            'K': 2,
            'Q': 2,
            'S': 2,
            'X': 2,
            'Z': 2,
            'D': 3,
            'T': 3,
            'L': 4,
            'M': 5,
            'N': 5,
            'R': 6,
            'A': 0,
            'E': 0,
            'I': 0,
            'O': 0,
            'U': 0,
            'Y': 0,
            'H': -1,
            'W': -1
        };
    };

    return self;
};

module.exports = new UtilsModule();

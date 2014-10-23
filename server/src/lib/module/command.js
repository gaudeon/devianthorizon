// Command template object

var Module = require('../module'),
    utils  = require('./utils');

var CommandModule = function() {
    var self = new Module();

    // This should be overwritten with a unique id for the command (e.g. the look command and synonyms could have the id 'look')
    self.id = 'undefined';

    // overwrite this and return the RegExp object that can be used for matching a command
    self.regex = RegExp('.');

    // overwrite this and return a list of words that the kernel can index on as a match for this command
    self.indexes = [ ];

    // overwrite this to set specific permission groups allowed to execute this command
    self.permissionGroups = [ 'character', 'admin', 'internal' ];

    // overwrite this to return help information used by the help system
    self.help = {
        'title'    : '',
        'header'   : '',
        'body'     : '',
        'footer'   : ''
    };

    // don't overwrite execute!!! overwrite runCmd which is called by execute
    function execute__meta() {
        return {
            'cmdLine' : {
                'required' : true,
                'type'     : 'string'
            },
            'words' : {
                'required' : true,
                'type'     : 'object'
            },
            'character' : {
                'required' : true,
                'type'     : 'object'
            },
            'kernel' : {
                'required' : true,
                'type'     : 'object'
            },
            'session' : {
                'required' : true,
                'type'     : 'object'
            },
            'callback' : {
                'required' : true,
                'type'     : 'function'
            }
        };
    }

    self.execute = function(args) {
        var check = self.validate(execute__meta(), args);
        if(! check.is_valid) throw check.errors();

        var callback = args.callback;
        delete args.callback;

        self.runCMD(args, function(resp) {
            callback(resp);
        });
    };

    function is_soundex_match__meta() {
        return {
            'soundex' : {
                'required' : true,
                'type'     : 'string'
            }
        };
    }

    self.is_soundex_match = function(args) {
        var check = self.validate(is_soundex_match__meta(), args);
        if(! check.is_valid) throw check.errors();

        var is_match = false;

        for(var i = 0; i < self.indexes.length; i++) {
            if(utils.soundex( { 'string' : self.indexes[i] } ) === args.soundex) {
                is_match = true;
                break;
            }
        }

        return is_match;
    };

    // overwrite this to run whatever this command is supposed to do, it should take two paramters an object with execute args (minus callback) and a callback function
    self.runCMD = function(args,callback) {
        throw "runCmd function for this object was not overwritten!";
    };

    return self;
};

module.exports = CommandModule; // NOTE: actual commands should set 'new <ThisCommand>()' to module.exports or things will get broken...

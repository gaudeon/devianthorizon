// Command parsing and execution

var Module = require('../module'),
    _      = require('underscore');

var KernelModule = function(options) {
    var self = new Module();

    // build search index for commands
    self.buildCommandIndex = function() {
        self.index = {};

        for(var i = 0; i < self.commands.length; i++) {
            var cmd = self.commands[i];
            for(var w = 0; w <  cmd.indexes.length; w++) {
                var word      = cmd.indexes[w];
                var chars     = word.split('');
                var index_key = '';

                for(var c = 0; c < chars.length; c++) {
                    index_key = index_key + chars[c];
                    if( !self.index[ index_key ] ) self.index[ index_key ] = [];
                    self.index[ index_key ].push(cmd);
                }
            }
        }
    };

    // find and run a command based on the command line provided
    self.parse = function(cmdLine) {
        var word     = (cmdLine.split(/\s+/))[0];
        var commands = [];

        // Find commands that meet the criteria
        for(var c = 0; c < word.length; c++) {
            if(self.index[ word ])
                commands = _.union(commands, self.index[ word ]);

            word = word.substr(0, word.length - 2);
        }

        // Find the first one that matches
        var cmdFound;
        for(var i = 0; i < commands.length; i++) {
            var cmd = commands[i];

            if(cmd.regex.test(cmdLine)) {
                cmdFound = cmd;
                break;
            }
        }

        if('undefined' === typeof cmdFound)
            return { output: 'Command not found' };

        // Execute it
        return cmdFound.execute(cmdLine);
    };

    // list of command objects
    self.commands = [
        require('./command/look')
    ];

    function initialize() {
        self.buildCommandIndex();
    }

    initialize();

    return self;
};

module.exports = KernelModule;

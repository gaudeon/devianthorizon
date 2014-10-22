// Command parsing and execution

var Module          = require('../module'),
    _               = require('underscore'),
    CharacterModule = require('./character'),
    utils           = require('./utils');

// Commands
var LookCmd        = require('./command/look'),
    SysTeleportCmd = require('./command/sys_teleport'),
    WalkCmd        = require('./command/walk');

var KernelModule = function(world) {
    var self = new Module();

    self.initialize = function() {
        self.world = world;
        self.index = {};

        // build search index for commands
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

    function execute__meta() {
        return {
            'cmdLine' : {
                'required' : true,
                'type'     : 'string'
            },
            'session'  : {
                'required' : true,
                'type'     : 'object'
            },
            'callback' : {
                'required' : true,
                'type'     : 'function'
            },
            'internal' : {
                'desc' : 'Set this to set the permission group to internal for internal commands',
                'type' : 'boolean'
            }
        };
    }

    // find and run a command based on the command line provided
    self.execute = function(args) {
        var check = self.validate(execute__meta(), args);
        if(! check.is_valid) throw check.errors();

        var internal = args.internal || false;

        // always load the character first so we can pass the character model to every command
        new CharacterModule(self.app).findMe({ id: args.session.sessionCharacter()._id }, function(character) {
            var words        = (args.cmdLine.split(/\s+/)),
                word         = words[0],
                word_soundex = utils.soundex({ 'string' : word }),
                commands     = [];

            // Find command by first word (abbreviations allowed)
            for(var c = 0; c < word.length; c++) {
                if(self.index[ word ]) {
                    commands = _.union(commands, self.index[ word ]);
                    break;
                }

                word = word.substr(0, word.length - 2);
            }

            //

            // Find the first one that matches
            var cmdFound;
            for(var i = 0; i < commands.length; i++) {
                var cmd = commands[i];

                if((internal || _.contains(cmd.permissionGroups, character.permissionGroup())) && cmd.regex.test(args.cmdLine)) {
                    cmdFound = cmd;
                    break;
                }
            }

            if('undefined' === typeof cmdFound) {
                var cmd_soundex = [];

                for(var cs = 0; cs < commands.length; cs++) {
                    if(commands[cs].is_soundex_match({ 'soundex' : word_soundex }))
                        cmd_soundex.push(commands[cs].id);
                }

                var output = 'Command not found.';

                if(cmd_soundex.length > 0)
                    output = output + ' ' + ' Did you mean:{{br()}}{{tab()}}' + cmd_soundex.join(', ');

                args.callback({ output: output });
                return;
            }

            // Execute it
            cmdFound.execute({
                cmdLine   : args.cmdLine,
                words     : words,
                character : character,
                kernel    : self,
                session   : args.session,
                callback  : function(resp) {
                    if(! _.has(resp, 'character')) _.extend(resp, { character: character.model.toObject() }); // Make sure character is in the response always

                    // Update character in session
                    args.session.sessionCharacter( resp.character );

                    args.callback(resp);
                }
            });
        });
    };

    // list of command objects
    self.commands = [
        new LookCmd(world),
        new SysTeleportCmd(world),
        new WalkCmd(world)
    ];

    self.initialize();

    return self;
};

module.exports = KernelModule;

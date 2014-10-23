// Help command

var Command     = require('../command');

var HelpCommand = function(world) {
    'use strict';
    
    var self = new Command();
    
    self.world = world;

    self.id = 'help';

    self.regex = new RegExp('^help');

    self.indexes = [
        'help'
    ];
    
    self.permissionGroups = [ 'character' ];

    self.help = {
        'title'    : 'Help',
        'header'   : 'Usage: help [command]',
        'body'     : "Helpful information about commands. You can type 'help commands' to get the list of available commands.",
        'footer'   : ''
    };

    self.runCMD = function(args, callback) {
        var output  = '';
        var command = args.words[1] || 'help';
        var cmdResp;
        
        if(command && command === 'commands') {
            var command_list = [];
            
            for(var i = 0; i < args.kernel.commands.length; i++) {
                // Use find command to help with permissions checking
                cmdResp = args.kernel.findCmd({
                    cmdLine   : args.kernel.commands[i].id,
                    character : args.character,
                    internal  : args.internal
                });
                
                if(cmdResp.cmd)
                    command_list.push( cmdResp.cmd.id );
            }
            
            output = 'Command List' + '{{br()}}{{br()}}{{tab()}}' + command_list.join(', ');
        } else {
            cmdResp = args.kernel.findCmd({
                cmdLine   : command,
                character : args.character,
                internal  : args.internal
            });
            
            if('undefined' === typeof cmdResp.cmd) {
                output = 'Could not find any help information for the supplied request.';
            }
            else {
                var info = cmdResp.cmd.help;
                
                output = info.title;
                
                if(info.header) {
                    output = output + '{{br()}}{{br()}}{{tab()}}' + info.header;
                }
                
                output = output + '{{br()}}{{br()}}{{tab()}}' + info.body;
                
                if(info.footer) {
                    output = output + '{{br()}}{{br()}}{{tab()}}' + info.footer;
                }
            }
        }
        
        callback({
            'output' : output
        });
    };

    return self;
};

module.exports = HelpCommand;

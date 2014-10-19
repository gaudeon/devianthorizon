// Logout command

var Command     = require('../command');

var LogoutCommand = function(world) {
    var self = new Command();
    
    self.world = world;

    self.id = 'logout';

    self.regex = RegExp('^logout');

    self.indexes = [
        'logout'
    ];
    
    self.permissionGroups = [ 'character' ];

    self.help = {
        'title'    : 'Logout',
        'header'   : 'Usage: logout',
        'body'     : 'Logout of game',
        'footer'   : ''
    };

    self.runCMD = function(args, callback) {
        args.character.logout(function() {
            callback({
                logout: true
            });
        });
    };

    return self;
};

module.exports = LogoutCommand;

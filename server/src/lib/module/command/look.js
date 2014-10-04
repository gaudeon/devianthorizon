// Look command

var Command = require('../command');

var LookCommand = function(options) {
    var self = new Command();

    self.id = 'look';

    self.regex = RegExp('^look');

    self.indexes = [
        'look'
    ];

    self.help = {
        'title'    : 'Look',
        'header'   : 'look',
        'body'     : 'Look around',
        'footer'   : ''
    };

    self.execute = function() {
        // TODO make this work

        return {
            output: 'You look at something...'
        };
    };

    return self;
};

module.exports = new LookCommand();

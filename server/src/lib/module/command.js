// Command template object

var Module = require('../module');

var CommandModule = function(options) {
    var self = new Module();

    // This should be overwritten with a unique id for the command (e.g. the look command and synonyms could have the id 'look')
    self.id = 'undefined';

    // overwrite this and return the RegExp object that can be used for matching a command
    self.regex = RegExp('.');

    // overwrite this and return a list of words that the kernel can index on as a match for this command
    self.indexes = [ ];

    // overwrite this to return help information used by the help system
    self.help = {
        'title'    : '',
        'header'   : '',
        'body'     : '',
        'footer'   : ''
    };

    // overwrite this to run whatever this command is supposed to do
    self.execute = function() {
        throw "execute function for this object was not overwritten!";
        return;
    };

    return self;
};

module.exports = CommandModule; // NOTE: actual commands should set 'new <ThisCommand>()' to module.exports or things will get broken...

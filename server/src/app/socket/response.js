// Response - object for socket io responses
//
// Params:
//      success => boolean determining success of resopnse
//      message => the string response
//      data    => any additional data
var Response = function(success, message, data) {
    var self = {};

    self.success = success;
    self.message = message;
    self.data    = data;

    return self;
};

module.exports = Response;

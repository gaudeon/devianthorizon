// Model for the lobby view

var LoginModel = Backbone.Model.extend({
    defaults: {
        id         : '',
        first_name : '',
        last_name  : '',
        email      : '',
        username   : '',
        created    : ''
    }
});

module.exports = LoginModel;
// Model for the login view

var LoginModel = Backbone.Model.extend({
    defaults: {
        login_error : '',
        password    : '',
        username    : ''
    }
});

module.exports = LoginModel;
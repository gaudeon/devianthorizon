// Model for the login layout

var LoginModel = Backbone.Model.extend({
    defaults: {
        login_error: ''
    }
});

module.exports = LoginModel;
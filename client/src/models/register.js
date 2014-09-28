// Model for the register view

var LoginModel = Backbone.Model.extend({
    defaults: {
        login_error: ''
    }
    // TODO: handle validation
});

module.exports = LoginModel;
// App Controller

/*
 * -- Models
 */
var LoginModel    = require('./models/login'),
    RegisterModel = require('./models/register'),
/*
 * -- Views
 */
    LoginView    = require('./views/login'),
    RegisterView = require('./views/register');

var Controller = Marionette.Controller.extend({

    initialize: function(app) {
        var self = this;
        
        // -- namespace for instantiated objects
        self.app         = app;
        self.models      = {};
        self.collections = {};
        self.views       = {};
    },
    
    login: function() {
        var self = this;
        
        self.views.login = new LoginView({
            model: new LoginModel()
        });
        
        self.app.mainRegion.show(self.views.login);
    },
    
    loginUpdate: function(data) {
        var self = this;
        
        self.views.login.model.set(data, {validate: true});
        self.views.login.render();
    },
    
    register: function() {
        var self = this;
        
        self.views.register = new RegisterView({
            model: new RegisterModel()
        });
        
        self.app.mainRegion.show(self.views.register);
    },
    
    registerUpdate: function(data) {
        var self = this;
        
        self.views.register.model.set(data, {validate: true});
        self.views.register.render();
    }

});

module.exports = Controller;
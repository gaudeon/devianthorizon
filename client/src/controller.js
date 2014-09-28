// App Controller

// -- Models
var LoginModel = require('./models/login'),
// -- Views
    LoginView = require('./views/login');

var Controller = Marionette.Controller.extend({

    initialize: function(app) {
        var self = this;
        
        // -- namespace for instantiated objects
        self.app         = app;
        self.models      = {};
        self.collections = {};
        self.views       = {};
        
        // Login - it has a custom
        self.views.login = new LoginView({
            model: new LoginModel()
        });
    },
    
    login: function() {
        var self = this;
        
        self.app.mainRegion.show(self.views.login);
    },
    
    loginUpdate: function(data) {
        var self = this;
        
        self.views.login.model.set(data);
        self.views.login.render();
    }

});

module.exports = Controller;
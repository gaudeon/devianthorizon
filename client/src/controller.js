// App Controller

/*
 * -- Models
 */
var LoginModel    = require('./models/login'),
    LobbyModel    = require('./models/lobby'),
    RegisterModel = require('./models/register'),
/*
 * -- Views
 */
    LoginView    = require('./views/login'),
    LobbyView    = require('./views/lobby'),
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
    
    vent: Backbone.Wreqr.radio.channel('global').vent,
    
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
    },
    
    lobby: function() {
        var self = this;
        
        self.vent.trigger('lobby', function(resp) {
            if(resp.success) {
                self.views.lobby = new LobbyView({
                    model: new LobbyModel(resp.data.result)
                });
                
                self.app.mainRegion.show(self.views.lobby);
            }
            else {
                self.app.router.navigate('login');
                self.login();
            }
        });
    }

});

module.exports = Controller;
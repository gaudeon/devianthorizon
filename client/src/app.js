// Entry point to mud client

// -- Models
var LoginModel = require('./models/login');

// -- Views
var LoginView = require('./views/login');

var App = new (Marionette.Application.extend({
    regions: {
        headerRegion : 'header',
        mainRegion   : 'main',
        footerRegion : 'footer'
    }
}))();

App.addInitializer(function(options) {
    App.router = new Marionette.AppRouter({
        routes: {
            ''     : 'login',
            'login': 'login'
        },
        login: function() {
            console.log('asdf');
            App.mainRegion.show(App.views.login);
        }
    });
});

App.addInitializer(function(options) {
    App.socket = {
        login : require('./socket/login'),
        world : require('./socket/world')
    };
    
    // -- Setup namespaces
    App.models      = {};
    App.collections = {};
    App.views       = {};
    
    // Login - it has a custom
    App.views.login = new LoginView({
        model: new LoginModel()
    });
    
    Backbone.history.start();
    
    if(window.location.hash == '')
        App.router.navigate('login', { trigger: true });
});

// Channel communication
App.vent.on('login', function(data) {
    App.socket.login.auth(data.username, data.password, function(resp) {
        if(resp.success === true) {
            // Login successful
        }
        else {
            App.views.login.model.set({
                username: data.username,
                password: data.password,
                login_error: resp.message
            });
            App.views.login.render();
        }
    });
});

module.exports = App;

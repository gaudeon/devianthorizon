// Entry point to mud client

var Controller = require('./controller'),
    Router     = require('./router');

var App = new (Marionette.Application.extend({
    regions: {
        headerRegion : 'header',
        mainRegion   : 'main',
        footerRegion : 'footer'
    }
}))();

App.addInitializer(function(options) {
    App.socket = {
        login : require('./socket/login'),
        world : require('./socket/world')
    };
    
    App.controller = new Controller(App);
    App.router     = new Router({ controller: App.controller });
    
    Backbone.history.start();
});

// Channel communication
App.vent.on('login', function(data) {
    App.socket.login.auth(data.username, data.password, function(resp) {
        if(resp.success === true) {
            // Login successful
        }
        else {
            _.extend(data, { login_error: resp.message });
            App.controller.loginUpdate(data);
        }
    });
});

// TODO: handle registration

module.exports = App;

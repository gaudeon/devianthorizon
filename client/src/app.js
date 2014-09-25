// Entry point to mud client

var LoginLayout = require('./views/layout/login');

var App = new (Marionette.Application.extend({
    regions: {
        headerRegion : 'header',
        mainRegion   : 'main',
        footerRegion : 'footer'
    }
}))();

App.addInitializer(function(options) {
    var self = this;
        
    self.socket = {
        login : require('./socket/login'),
        world : require('./socket/world')
    };
    
    // Setup Layouts
    self.layouts = {};
    self.layouts.login = new LoginLayout();
    
    // Display default layout
    self.mainRegion.show(self.layouts.login);
});

// Channel communication
App.vent.on('login', function(data) {
    App.socket.login.auth(data.username, data.password, function(resp) {
        console.log(resp);
    });
});

module.exports = App;

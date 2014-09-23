// Entry point to mud client

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
});

module.exports = App;

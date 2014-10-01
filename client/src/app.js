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
        lobby : require('./socket/lobby'),
        world : require('./socket/world')
    };
    
    App.controller = new Controller(App);
    App.router     = new Router({ controller: App.controller });
    
    Backbone.history.start();
});

// Channel communication
App.vent.on('login', function(data) {
    App.socket.login.auth(data, function(resp) {
        if(resp.success === true) {
            App.router.navigate('lobby');
            App.controller.lobby();
        }
        else {
            _.extend(data, { login_error: resp.message });
            App.controller.loginUpdate(data);
        }
    });
});

App.vent.on('register', function(data) {
    App.socket.login.register(data, function(resp) {
        if(resp.success === true) {
            App.router.navigate('lobby');
            App.controller.lobby();
        }
        else {
            _.extend(data, { register_error: resp.message });
            App.controller.registerUpdate(data);
        }
    });
});

App.vent.on('lobby', function(callback) {
    App.socket.lobby.userInfo(function(resp) {
        callback(resp);
    });
});

App.vent.on('createCharacter', function(data) {
    App.socket.lobby.createCharacter(data, function(resp) {
        if(resp.success === true) {
            App.router.navigate('lobby');
            App.controller.lobby();
        }
        else {
            _.extend(data, { general_error: resp.message });
            App.controller.createCharacterUpdate(data);
        }
    });
});

App.vent.on('characterList', function(callback) {
    App.socket.lobby.characterList(function(resp) {
        callback(resp);
    });
});

App.vent.on('joinWorld', function(data, callback) {
    App.socket.world.joinWorld(data,function(resp) {
        App.router.navigate('game');
        App.controller.game();
    });
});

App.vent.on('enterWorld', function(callback) {
    App.socket.world.enterWorld(function(resp) {
        callback(resp);
    });
});

App.vent.on('command', function(data, callback) {
    App.socket.world.command(data, function(resp) {
        callback(resp);
    });
});

module.exports = App;

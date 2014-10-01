// App Controller

/*
 * -- Models
 */
var CharacterModel       = require('./models/character'),
    CreateCharacterModel = require('./models/create_character'),
    GameModel            = require('./models/game'),
    LoginModel           = require('./models/login'),
    LobbyModel           = require('./models/lobby'),
    RegisterModel        = require('./models/register'),

/*
 * -- Collections
 */
    Characters   = require('./collections/characters'),

/*
 * -- Views
 */
    CharacterView       = require('./views/character'),
    CreateCharacterView = require('./views/create_character'),
    GameView            = require('./views/game'),
    LoginView           = require('./views/login'),
    LobbyView           = require('./views/lobby'),
    RegisterView        = require('./views/register');

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
        
        // triggering lobby checks to make sure we are logged in
        self.vent.trigger('lobby', function(lobbyResp) {
            if(lobbyResp.success) {
                self.vent.trigger('characterList', function(characterListResp) {
                    self.views.lobby = new LobbyView({
                        model: new LobbyModel(lobbyResp.data.result)
                    });
                    
                    if(characterListResp.success) {
                        _.each(characterListResp.data.result, function(o) {
                            self.views.lobby.collection.add({
                                id        : o._id,
                                full_name : o.fullName,
                                created   : (o.createdDate.split(/T/))[0]
                            });
                        });
                    }
                    
                    self.app.mainRegion.show(self.views.lobby);
                });
            }
            else {
                self.app.router.navigate('login');
                self.login();
            }
        });
    },
    
    createCharacter: function() {
        var self = this;
        
        // triggering lobby checks to make sure we are logged in
        self.vent.trigger('lobby', function(resp) {
            if(resp.success) {
                self.views.create_character = new CreateCharacterView({
                    model: new CreateCharacterModel()
                });
                
                self.app.mainRegion.show(self.views.create_character);
            }
            else {
                self.app.router.navigate('login');
                self.login();
            }
        });
    },
    
    createCharacterUpdate: function(data) {
        var self = this;
        
        self.views.create_character.model.set(data, {validate: true});
        self.views.create_character.render();
    },
    
    game: function() {
        var self = this;
        
        self.views.game = new GameView({
            model: new GameModel()
        });
        
        self.app.mainRegion.show(self.views.game);
    }

});

module.exports = Controller;
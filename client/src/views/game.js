// The game view

var GameView = Backbone.Marionette.ItemView.extend({
    template: require('../../templates/game.html'),
    
    className: 'game',

    events: {
    },
    
    initialize: function() {
        var self = this;
    },
    
    onShow: function() {
        var self = this;
        
        self.$console = $(self.$el.find('#console'));
        self.$command = $(self.$el.find('#command'));
        
        var radio = Backbone.Wreqr.radio.channel('global');
        radio.vent.trigger('enterWorld', function(resp) {
            
            self.addToConsole("Welcome " + resp.data.result.character.fullName + "!{{ br() }}{{ br() }}" + resp.data.result.output);
        });
    },
    
    addToConsole: function(output) {
        var self = this;
        
        self.$console.html( self.$console.html() + self.parse(output) );
    },
    
    parse: function(html) {
        var self = this;
        
        var oldSettings = _.templateSettings;
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g
        };
        
        var parsed = (_.template(html))(self.templateEnv());
        
        _.templateSettings = oldSettings;
        
        return parsed;
    },
    
    templateEnv: function() {
        return {
            br: function() {
                return '<br>';
            }
        };
    }
});

module.exports = GameView;

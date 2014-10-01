// The register view

var RegisterView = Backbone.Marionette.ItemView.extend({
    template: require('../../templates/register.html'),

    className: 'register',
    
    events: {
        'click button': 'register'
    },
    
    register: function(ev) {
        var self  = this;
        var radio = Backbone.Wreqr.radio.channel('global');
        var data = {};
        $.each(self.$el.find('form.register_form').serializeArray(), function() { data[this.name] = this.value; });
        // Validate data before attempting a socket connection
        var err = self.model.validate(data);
        if(err) {
            self.render();
        }
        else {
            radio.vent.trigger('register', data);
        }
    }
});

module.exports = RegisterView;
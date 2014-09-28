// The register view

var RegisterView = Backbone.Marionette.ItemView.extend({
    template: require('../../templates/register.html'),

    events: {
        'click button': 'register'
    },
    
    register: function(ev) {
        var self  = this;
        var radio = Backbone.Wreqr.radio.channel('global');
        var data = {};
        $.each(self.$el.find('form.login_form').serializeArray(), function() { data[this.name] = this.value; });
        radio.vent.trigger('register', data);
        // TODO: Make registration work...
    }
});

module.exports = RegisterView;
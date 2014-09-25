// The login layout

var LoginLayout = Backbone.Marionette.LayoutView.extend({
    template: require('../../../templates/layout/login.html'),

    regions: {
        formRegion: 'form.layout_login_form'
    },
  
    events: {
        'click button': 'login'
    },
    
    login: function(ev) {
        var self  = this;
        var radio = Backbone.Wreqr.radio.channel('global');
        var data = {};
        $.each($(self.formRegion.el).serializeArray(), function() { data[this.name] = this.value; });
        radio.vent.trigger('login', data);
    }
});

module.exports = LoginLayout;
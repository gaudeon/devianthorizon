// The create character view

module.exports = (function() {
    'use strict';
    
    return Backbone.Marionette.ItemView.extend({
        template: require('../../templates/create_character.html'),
    
        className: 'create-character',
        
        events: {
            'click button': 'create'
        },
        
        create: function(ev) {
            var self  = this;
            var radio = Backbone.Wreqr.radio.channel('global');
            var data = {};
            $.each(self.$el.find('form.create_character_form').serializeArray(), function() { data[this.name] = this.value; });
            // Validate data before attempting a socket connection
            var err = self.model.validate(data);
            if(err) {
                self.render();
            }
            else {
                radio.vent.trigger('createCharacter', data);
            }
        }
    });
})();

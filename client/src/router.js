// App router

var Router = Marionette.AppRouter.extend({
    appRoutes: {
        ''     : 'login',
        'login': 'login'
    }
});

module.exports = Router;
App = Ember.Application.create();

App.Router.map(function () {
    this.route('index', { path: '/' });
});

App.IndexRoute = Ember.Route.extend({
    actions: {
        "submit": function () {
            var searchTerm = this.controllerFor('index').get('searchTerm');
            alert('you searched for %@'.fmt(searchTerm));
        }
    }
});

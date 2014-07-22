App = Ember.Application.create();

App.Constants = {
    BASE_URL: 'https://na.api.pvp.net/api/lol/na/',
    API_KEY: '0a035921-3528-4bc5-998b-0f2c7658229a'
}

App.Router.map(function () {
    this.route('index', { path: '/' });
    this.resource('summoner', { path: '/:summonerId' }, function () {
        this.route('rankedStats');
        this.route('champStats');
    });
});

App.IndexRoute = Ember.Route.extend({
    actions: {
        "submit": function () {
            var searchTerm = this.controllerFor('index').get('searchTerm'),
                normalizedSearchTerm = searchTerm.replace(/\s+/g, '');
                url =  '%@v1.4/summoner/by-name/%@?api_key=%@'.fmt(App.Constants.BASE_URL, searchTerm, App.Constants.API_KEY),
                that = this;

            $.ajax(url).then(function (result) {
                that.transitionTo('summoner', result[normalizedSearchTerm].id);
            }, function (error) {
                alert('No summoner with that name');
            });
        }
    }
});

App.SummonerRoute = Ember.Route.extend({
    model: function (params) {
        var id = params.summonerId,
            url = '%@v1.4/summoner/%@?api_key=%@'.fmt(App.Constants.BASE_URL, id, App.Constants.API_KEY);

        return new Promise (function (resolve, reject) {
            $.ajax(url).then(function (result) {
                resolve(result[id]);
            }, function () {
                console.log('there was an error getting the user object in summoner route');
                reject();
            });
        });
    }
});

App.SummonerRankedStatsRoute = Ember.Route.extend({
    model: function () {
        var summoner = this.modelFor('summoner'),
            summonerId = summoner.id,
            url = '%@v2.4/league/by-summoner/%@/entry?api_key=%@'.fmt(App.Constants.BASE_URL, summonerId, App.Constants.API_KEY);

        return new Promise(function (resolve, reject) {
            $.ajax(url).then(function (result) {
                result = result[summonerId][0];
                console.log(result);
                resolve({
                    name: result.name,
                    tier: result.tier,
                    division: result.entries[0].division,
                    leaguePoints: result.entries[0].leaguePoints,
                    wins: result.entries[0].wins
                });
            }, function () {
                console.log('error in getting summoner ranked stats in summonerRankedStatsRoute');
                reject();
            });
        });
    }
});

App.SummonerController = Ember.ObjectController.extend({});
App.SummonerRankedStatsController = Ember.ObjectController.extend({});

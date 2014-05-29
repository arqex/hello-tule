var config = require('config');

module.exports = {
	init: function(hooks){
		config.nedb = {
			dataPath: __dirname + '/data'
		};

		hooks.addFilter('routes:static', function(routes){
			routes.push({url: 'hellotule', path: 'hello-tule/r'});
			return routes;
		});

		hooks.addFilter('routes:server', function(routes){
			//The splice is necessary to add the route before the default one.
			routes.splice(-1, 0, {route: 'get::/hello-tule/getdata', controller: '/hello-tule/helloTule::getData'});
			return routes;
		});

		hooks.addFilter('routes:client', function(routes){
			//The splice is necessary to add the route before the default one.
			routes.splice(-1, 0, {route: 'hellotule', controller:  config.mon.baseUrl + 'r/hellotule/app/helloController.js'});
			return routes;
		})
	},

	getData: function(req, res){
		var helloData = [
			{name: 'Tule', img: config.mon.baseUrl + 'r/hellotule/img/tule.jpg'},
			{name: 'Snowden', img: config.mon.baseUrl + 'r/hellotule/img/snowden.jpg'},
			{name: 'Assange', img: config.mon.baseUrl + 'r/hellotule/img/assange.jpg'}
		];
		res.json(helloData);
	}
};
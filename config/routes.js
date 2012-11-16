module.exports = function (app) {
	var base = require('../app/controllers/base');

	// ACTIVITIES ROUTES
	var activities = require('../app/controllers/activities');
	app.get('/activities', activities.index);
	app.get('/activities/search', activities.search);
	app.get('/activities/:aid', activities.show);

	// home Route
	app.get('/', base.index);

	// $)$ Route
	app.get('/*', base.error);

}
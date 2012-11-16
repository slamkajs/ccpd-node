var solr = require('../data/solr_db');

exports.getActivity = function(aid) {
	activity = {};
	console.log(arguments);
	query = 'id:' + arguments.aid;
	// solr.get('activities/select?q=id:' + aid + '&wt=json&indent=true', function(err, res) { 
	// 	activities = JSON.parse(res);
	// 	activitiesList = activities.response.docs;

	// 	activity = activitiesList;
	// });

	return activity;
}

exports.getActivities = function (req, res) {
	solr.get('activities/select?q=*:*&wt=json&indent=true', function(err, res) { 
		activities = JSON.parse(res);
		activitiesList = activities.response.docs;

		return activitiesList;
	});
}
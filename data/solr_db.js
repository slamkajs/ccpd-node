var solr = require('solr-client');

var client = solr.createClient({
	host: 'localhost',
	port: '8983',
	core: 'activities',
	path: '/solr'
});


module.exports = client;
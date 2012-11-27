var solr = require('solr-client');

var client = solr.createClient({
	host: '127.0.0.1',
	port: '8983',
	core: 'activities',
	path: '/solr'
});


module.exports = client;
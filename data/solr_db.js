var solr = require('solr-client');

var client = solr.createClient({
	host: '10.168.1.55',
	port: '8983',
	core: 'activities',
	path: '/solr'
});


module.exports = client;
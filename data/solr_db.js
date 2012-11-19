var solr = require('solr-client');

var client = solr.createClient({
	host: '108.59.252.197',
	port: '8180',
	core: 'ccpd_dev',
	path: '/solr'
});


module.exports = client;
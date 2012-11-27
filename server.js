var express = require('express'),
	haibu = require('haibu'),
  eyes = require('eyes');

var client = new haibu.drone.Client({
	host: 'localhost',
	port: process.env.PORT || 3000
});

client.set('views', __dirname + '/app/views');
client.set('view engine', 'ejs');
client.set("view options", { layout: __dirname +"/app/views/layouts/layout.ejs" });

require('./config/routes')(client);

client.on('listening',function(){
    console.log('ok, server is running');
});z

client.start(app, function(err, res) {
  if(err) {
    console.log('Error spawning app: ' + app.name);
    return eyes.inspect(err);
  }

  console.log('Successfully spawned app: ' + app.name);
  eyes.inspect(result);
});

client.start(app, function(err, result) {
    eyes.inspect(err);
    eyes.inspect(result);
});


// var port = process.env.PORT || 3000;
// client.listen(port);
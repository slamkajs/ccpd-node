var express = require('express')
  , port = process.env.PORT || 3001
  , http = require('http')
  , eyes = require('eyes')

var app = express();


app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.set("view options", { layout: __dirname +"/app/views/layouts/layout.ejs" });

require('./config/routes')(app);

app.listen(port);

app.on('listening',function(){
    console.log('ok, server is running');
});

// // Create a new client for communicating with the haibu server
// var client = new haibu.drone.Client({
//   host: 'http://haibuhome.com/',
//   port: 9002
// });

// // Attempt to start up a new application
// client.start(settings, function (err, result) {
//   if (err) {
//     console.log('Error spawning app: ' + settings.name);
//     return eyes.inspect(err);
//   }

//   console.log('Successfully spawned app:');
//   eyes.inspect(result);
// });

// client.start(settings, function (err, result) {
//   eyes.inspect(err);
//   eyes.inspect(result);
// });

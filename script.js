var express = require('express');

var app = express.createServer();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.set("view options", { layout: __dirname +"/app/views/layouts/layout.ejs" });

require('./config/routes')(app);

app.on('listening',function(){
    console.log('ok, server is running');
});
 
app.listen(3000);
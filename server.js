var express = require('express');
var path = require('path');

var app = express();
var server = app.listen(80, function() {
  console.log("Server started");
});

app.use('/', express.static(path.resolve('')));
app.use('/assets', express.static(path.resolve('assets')));
app.use('/phaser', express.static(path.resolve('phaser')));

app.get('/', function(req, res) {
  res.sendFile(  __dirname + '/index.html' );
});

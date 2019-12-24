var express = require('express');
var path = require('path');
var nocache = require('node-nocache');

var app = express();
var server = app.listen(39, function() {
  console.log("QuackTales server started");
});

app.use(nocache); // prevent client caching for images, sounds etc
app.use('/', express.static(path.resolve('')));
app.use('/assets', express.static(path.resolve('assets')));
app.use('/phaser', express.static(path.resolve('phaser')));
app.use('/build', express.static(path.resolve('build')));

app.get('/', function(req, res) {
  res.sendFile(  __dirname + '/index.html' );
});

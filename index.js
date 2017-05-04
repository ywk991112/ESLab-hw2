var express = require('express');
var app = express();
var server = require('http').Server(app);
var os = require('os');
var path = require('path');
var io = require('socket.io').listen(server),
	nicknames = [];
// climate
// var tessel = require('tessel');
// var climate = climatelib.use(tessel.port['A']);

// servo
// var servo = servolib.use(tessel.port['B']);

// var port = 8888;
var port = 8000;
var unit_temp = "F";
var fan_level = 0;
var update_interval = 1000;




// servo end

server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '')));


// ==== socket io ====

io.sockets.on('connection', function(socket){
  console.log("Connected");
});

// auto update
setInterval(function () {
  var tem = Math.random();
  var hum = Math.random();
  var fan = Math.random();
  io.sockets.emit('update tem', tem);
  io.sockets.emit('update hum', hum);
  io.sockets.emit('update fan', fan);

}, update_interval); // Every 500 milliseconds

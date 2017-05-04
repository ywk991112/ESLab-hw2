var express = require('express');
var app = express();
var server = require('http').Server(app);
var os = require('os');
var path = require('path');
var io = require('socket.io').listen(server),
	nicknames = [];
// climate
// var tessel = require('tessel');
var climatelib = require('climate-si7020');
// var climate = climatelib.use(tessel.port['A']);

// servo
var servolib = require('servo-pca9685');
// var servo = servolib.use(tessel.port['B']);

// var port = 8888;
var port = 8000;
var unit_temp = "F";
var fan_level = 0;
var update_interval = 1000;

// climate 
/*
climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
      // console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
      setTimeout(loop, 3000);
      });
    });
  });
});
*/


// climate end

// servo
var servo1 = 1; // We have a servo plugged in at position 1



// servo end

server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '')));


// ==== socket io ====

io.sockets.on('connection', function(socket){
  console.log("Connected");
  socket.on('chat message', function(msg){
  	console.log(msg);
    io.sockets.emit('chat message', msg);
  });

  // manually update
  socket.on('update info', function(msg){
		console.log("manual.");
  	// console.log(msg);
  	climate.readTemperature('f', function (err, temp) {
  	  climate.readHumidity(function (err, humid) {
  	  	console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
  	  	if (unit_temp == "F"){
        io.sockets.emit('update tem', temp);
	    	io.sockets.emit('update hum', humid);
  	  	}
  	  	if (humid<60){
  	  		fan_level = 0;
  	  	}else if(humid>65 && humid<70){
  			fan_level = 2;
  	  	}else if(humid>70 && humid<75){
  			fan_level = 3;
  	  	}else if(humid>75 && humid<80){
  			fan_level = 4;
  	  	}else if(humid>80){
  			fan_level = 5;
  	  	}else{
  	  		fan_level = 1;
  	  	}

  	  	// setTimeout(loop, 300);
  	  });
  	  io.sockets.emit('update fan', {fan: fan_level});
  	  // update_servo(servo, servo1, fan_level*0.1);

  	});
  });

  // update interval
  socket.on('update interval', function(msg){
  	console.log(msg);
  	update_interval = parseInt(msg);

  });

  // auto update
  setInterval(function () {
    console.log("auto");
    io.sockets.emit('update tem', 80);
    io.sockets.emit('update hum', 0.5);
    io.sockets.emit('update fan', 2);

  }, update_interval); // Every 500 milliseconds


  function update_servo(servo, servo1, position){
  	// console.log("Pos:", position);
	servo.move(servo1, position);
  };
});
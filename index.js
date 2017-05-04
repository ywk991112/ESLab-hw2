var express = require('express');
var app = express();
var server = require('http').Server(app);
var os = require('os');
var path = require('path');
var io = require('socket.io').listen(server),
	nicknames = [];
// climate
var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);

// servo
var servolib = require('servo-pca9685');
var servo = servolib.use(tessel.port['B']);

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

climate.on('error', function(err) {
  console.log('error connecting module', err);
});
// climate end

// servo
var servo1 = 1; // We have a servo plugged in at position 1

servo.on('ready', function () {
  var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

  //  Set the minimum and maximum duty cycle for servo 1.
  //  If the servo doesn't move to its full extent or stalls out
  //  and gets hot, try tuning these values (0.05 and 0.12).
  //  Moving them towards each other = less movement range
  //  Moving them apart = more range, more likely to stall and burn out
  servo.configure(servo1, 0.05, 0.12);
  
  /*
  servo.configure(servo1, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);
      //  Set servo #1 to position pos.
      servo.move(servo1, position);

      // Increment by 10% (~18 deg for a normal servo)
      position += 0.1;
      if (position > 1) {
        position = 0; // Reset servo position
      }
    }, 2000); // Every 500 milliseconds
  });
  */
});


// servo end

server.listen(port, function () {
  console.log(`http://${os.hostname()}.local:${port}`);
});

// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '')));


// ==== socket io ====

io.sockets.on('connection', function(socket){
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
  	  update_servo(servo, servo1, fan_level*0.1);

  	});
  });

  // update interval
  socket.on('update interval', function(msg){
  	console.log(msg);
  	update_interval = parseInt(msg);

  });

  // auto update
  setInterval(function () {
		climate.readTemperature('f', function (err, temp) {
		  climate.readHumidity(function (err, humid) {
		  	console.log("auto.");
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
		  io.sockets.emit('update fan', fan_level);
		  update_servo(servo, servo1, fan_level*0.1);

		});
  }, update_interval); // Every 500 milliseconds


  function update_servo(servo, servo1, position){
  	// console.log("Pos:", position);
	servo.move(servo1, position);
  };
});
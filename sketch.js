let serial;  //variable to hold an instance of the serialport library
let basePosition; // variable to hold input data from arduino
let portName = "/dev/tty.usbserial-1420"; // fill in your serial port name here 

// Variables for the ball
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var diameter = 50;
var xBallChange = 5;
var yBallChange = 5;

// Variables for the paddle
var xPaddle;
var yPaddle;
var paddleWidth = 100;
var paddleHeight = 25;

var started = false;
var score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  serial = new p5.SerialPort();

 serial.open(portName);

 serial.on('connected', serverConnected);


 serial.on('data', gotData);

 serial.on('error', gotError);
  
 serial.on('open', gotOpen);

 serial.on('close', gotClose);
}

function serverConnected() {
 print("Connected to Server");
}


function gotOpen() {
 print("Serial Port is Open");

}

function gotClose(){
 print("Serial Port is Closed");
}

function gotData() {
  let currentData = Number(serial.read());
  if(!basePosition) {
    basePosition = currentData;
    print(basePosition);  
  }
  if( currentData - basePosition > 4) {
   xPaddle -= 50;
  }
  if( currentData - basePosition < -4) {
   xPaddle += 50;
  }
}

function gotError(err) {
 print('Something went wrong with the serial port. ' + err);
}

function draw() {
  background(0);
  
  // Ball bounces off walls
  xBall += xBallChange;
  yBall += yBallChange;
  if (xBall < diameter/2 || 
      xBall > windowWidth - 0.5*diameter) {
    xBallChange *= -1;
  }
  if (yBall < diameter/2 || 
      yBall > windowHeight - diameter) {
    yBallChange *= -1;
  }
  
  // Detect collision with paddle
  if ((xBall > xPaddle &&
      xBall < xPaddle + paddleWidth) &&
      (yBall + (diameter/2) >= yPaddle)) {
    xBallChange *= -1;
    yBallChange *= -1;
    score++;
  }
  
  // Draw ball
  fill(255, 0, 255);
  noStroke();
  ellipse(xBall, yBall, diameter, diameter);
  
  // Update paddle location
  if (!started) {
    xPaddle = windowWidth / 2;
    yPaddle = windowHeight - 100;
    started = true;
  }
  
  // Draw paddle
  fill(0, 255, 255);
  noStroke();
  rect(xPaddle, yPaddle, paddleWidth, paddleHeight);
  
  // Draw score
  fill(0, 255, 255);
  textSize(24);
  text("Score: " + score, 10, 25);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    xPaddle -= 50;
  } else if (keyCode === RIGHT_ARROW) {
    xPaddle += 50;
  }
}

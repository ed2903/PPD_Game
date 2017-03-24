// NOTES:
// - A Victor is a 2 dimensional vector
//
// - Our game is object orientated meaning the ball, bar and segments are individual objects
// -----------------------------------------

// IDEAS OF STUFF TO ADD
// - power ups: multiball, altering bar length (random on colision or colsion with certain bars?), ball strength (ball does more damage for a while)...
// - highscores: (looking at you Johnny <3 )
// - graphics: dick about with the ctx stuff in the draw procedures so its not so plain
// - main menu
// - background
// - html / css for no canvas related stuff
// - fix some bugs: kill the ball when it leaves the screen, add lives, record score / score system
// ------------------------------------------


// gets the canvas as a variable
var game = document.getElementById('Game');
// gets the context of the canvas as a variable
var ctx = game.getContext('2d');
// default width of each segment
var segmentWidth = 20;
// default line width for basic shapes e.g. the ball
var defaultLineWidth = 2;
// holds the coordinates of the mouse in a vector
var mouseCoords = new Victor(0,0);

// Defines a Segment
class Segment{

	// the default constructor for a segment
	constructor(centre,radius,startAngle,endAngle,hitsRequired){
		
		// the origin of the circle the segment belongs to (e.g. the middle of the canvas)
		this.centre = centre;
		// the radius of the circle the segment belongs to
		this.radius = radius;
		// the starting angle of the segment
		this.startAngle = startAngle;
		// the ending angle of the segment
		this.endAngle = endAngle;
		// the number of hits required to remove the segment
		this.hitsRequired = hitsRequired;
		// the color of the segment
		this.color = getColor(hitsRequired);
	}


	// draws the segment on the canvas
	Draw(){

		ctx.lineWidth = segmentWidth;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.centre.x,this.centre.y,this.radius,this.startAngle,this.endAngle,this.color);
		ctx.stroke();

	}

} 

// Defines the Ball
class Ball{


	// the default constructor for the ball
	constructor(position,radius,velocity,speed,color){

		// the position of the ball on the canvas
		this.position = position;
		// the radius of the ball
		this.radius = radius;
		// the balls velocity ( the balls direction * its speed)
		this.velocity = velocity;
		// the speed of the ball
		this.speed = speed;
		// the color of the ball
		this.color = color;
		
	}

	// Draws the ball onto the canvas
	Draw(){

		ctx.lineWidth = defaultLineWidth;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2,this.color);
		ctx.fill();

	}

} 


// Defines the bar
class Bar{

	// the default constructor for the bar
	constructor(centre,radius,angle,startAngle,color){

		// the centre of the circle which the bar belongs to
		this.centre = centre;
		// the radius of the circle the bar belongs to
		this.radius = radius;
		// the start angle of the bar
		this.startAngle = startAngle;
		// the end angle of the bar
		this.endAngle = startAngle + angle;
		// the length of the bar expressed as an angle, the greater the angle the greater the length of the bar
		this.angle = angle;
		// the color of the bar
		this.color = color;
	}


	// Draws the bar onto the canvas
	Draw(){

		ctx.lineWidth = segmentWidth;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.centre.x,this.centre.y,this.radius,this.startAngle,this.endAngle,this.color);
		ctx.stroke();

	}

} 

// converts the angle, a, from  degrees into radians
// (this is primarily used for inputting intial values for the angles involved with creating the bar)
function toRadians(a){
	return (Math.PI / 180) * a;
}

// converts the angle, a, from  radians into degrees
// (mainly used in outputting angles to the console in a meaning)
function toDegrees(a){
	return (180 / Math.PI) * a;
}

// generates a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// generates a random integer in a range
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getColor(hitsRequired){

	switch(hitsRequired){

		case 1:
			return '#e6f2ff';
			break;
		case 2:
			return '#cce6ff';
			break;
		case 3:
			return '#b3d9ff';
			break;
		case 4:
			return '#99ccff';
			break;
		case 5:
			return '#80bfff';
			break;
		case 6:
			return '#66b3ff';
			break;
		case 7:
			return '#4da6ff';
			break;
		case 8:
			return '#3399ff';
			break;
		case 9:
			return '#1a8cff';
			break;		
		case 10:
			return '#0080ff';
			break;	
		default:
			return '#0073e6';
			break;
	}

}

// Declares the array of segments which is initially empty
var segments = [];

// Declares the ball and the bar
var ball = new Ball(new Victor(game.width * 7/8,game.height /2),3,new Victor(getRandomInt(-10,-1),getRandomInt(-5,5)),4,'#FF00FF');
var bar  = new Bar(new Victor(game.width / 2,game.height / 2),(game.width / 2) - 40,toRadians(30),toRadians(-15),'#FF00FF');

// Initalise the game
Init();

// Kick start the main update loop
requestAnimationFrame(MainUpdateLoop);

// Creates the segments around the centre of canvas
function InitSegments(){

		var toggle = true;
		var hitsToBreak = 8;

		// the number of 'rings' around the centre of the canvas (9-3=6, so 6 rings), starting with 3 equal segments and going up to 8
		for (sn=3; sn < 9; sn++)
		{	
			// draw each segment in the rings based on the current ring number
			for(i=0; Math.ceil(i) < Math.PI * 2; i += (Math.PI * 2) / sn)
			{	
				// adds the new segment to the array of segments
				if (toggle)
				{
					segments.push(new Segment(new Victor(game.width / 2, game.height / 2),30 + sn*segmentWidth,i + (Math.PI * 2) / sn,i,hitsToBreak));
					toggle = false;
				}
				else
				{
					segments.push(new Segment(new Victor(game.width / 2, game.height / 2),30 + sn*segmentWidth,i + (Math.PI * 2) / sn,i,hitsToBreak - 2));
					toggle = true;
				}
			}

			hitsToBreak--;
		}
}



function LoadSegmentsFromJSON(level){

	$.getJSON("levels/" + level + ".json", function(json) {

		console.info(json);

   		var j = json;

   		for (var i = 0, len = j.length; i < len; i++) {

			segments.push(new Segment(new Victor(j[i].centre.x, j[i].centre.y),j[i].radius,j[i].startAngle,j[i].endAngle,j[i].hitsRequired));

		}


	});

}

function SegmentsToJSON(){

	var data = JSON.stringify(segments);
	var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
	window.open(url, '_blank');
	window.focus();

}

// draw the segments
function DrawSegments(){
	
	// goes through all the segments in the array of segments
	for (i=0; i <= segments.length - 1; i++)
	{
		// draws the current segment
		segments[i].Draw();
	}
}


// draw the ball
function DrawBall(){
	
	ball.Draw();
	
}

// draw the bar
function DrawBar(){
	
	bar.Draw();
	
}

// draw the ball, bar and segments
function Draw(){
	
	DrawBall();
	DrawBar();
	DrawSegments();
	
}


// update the bar
function UpdateBar(){

	// move the bar to the angular position of the mouse
	RotateBarAroundCentre();
	
}


// Update the ball
function UpdateBall(){
	
	// gets the distance of the ball from the centre
	var ballDist = Math.hypot(ball.position.y - bar.centre.y, ball.position.x - bar.centre.x);
	// gets the angle of the ball from the x-axis
	var ballAngle = Math.atan2(ball.position.y - bar.centre.y,ball.position.x - bar.centre.x );
	
	// corrects the angle of the ball so it goes from 0 to Math.PI * 2 (a full circle)
	if (ballAngle < 0)
	{
		ballAngle = ballAngle + Math.PI*2;
	}



	

	
	// checks if the ball is touching / beyond the bar by comparing radii and angles
	if ((ball.radius + ballDist >= bar.radius) && (ballAngle <= bar.startAngle && ballAngle >= bar.endAngle)  )
	{
		// get a vector that represents the normal for the bar and the ball
		var norm = new Victor(ball.position.x - bar.centre.x,ball.position.y - bar.centre.y);
		// normalises that vector
		norm.norm();
		
		// gets the dot product of the vector and the normal
		var dot = ball.velocity.dot(norm);
		// times the dot product by -2
		var c = dot * -2;
		// multiply the normal of the vector by a vector comprised of the dot product
		norm.multiply(new Victor(c,c));
		// add the vector to the balls velocity
		ball.velocity.add(norm);
	}
	
	
	
	// same idea as above but does it for all the segments

	for (i=0; i <= segments.length - 1; i++)
	{
		
		
		
		if (((ball.radius + ballDist <= segments[i].radius + segmentWidth) && (ball.radius + ballDist >= segments[i].radius - segmentWidth) ) && ((ballAngle >= segments[i].endAngle && ballAngle <= segments[i].startAngle)))
		{


			// increases the speed of the ball and reduces the hits required of the bar
			segments[i].hitsRequired--;
			ball.speed += (1 / ball.speed) * 0.02;


			// if the number of hits required for the current segment equals 0 remove it from the array of segments
			if (segments[i].hitsRequired == 0)
			{
				segments.splice(i,1);
			}
			
			var norm = new Victor(ball.position.x - bar.centre.x,ball.position.y - bar.centre.y);
			norm.norm();
			
			var dot = ball.velocity.dot(norm);
			var c = dot * -2;
			norm.multiply(new Victor(c,c));
			ball.velocity.add(norm);

		}
	}

	
	// normalise the velocity of the ball (makes it have a magnitude of 1 but keep its direction)
	ball.velocity.norm();
	// times it by the speed 
	ball.position.add(ball.velocity.multiply(new Victor(ball.speed,ball.speed))); 
	
}

// rotates the bar to the postion of the mouse
function RotateBarAroundCentre(){
	
	// get the angle of the mouse in relation to the x-axis
	angle = Math.atan2(mouseCoords.y - bar.centre.y,mouseCoords.x - bar.centre.x );

	// makes the angle of the bar go from 0 to 360
	if (angle < 0)
	{
		angle = angle + Math.PI*2;
	}

	// sets the start and end angle of the bar so that it is at the approiate position and length
	bar.endAngle = (angle - bar.angle / 2);
	bar.startAngle = (angle + bar.angle / 2);
	
}

// Initalise the segments 
function Init(){
	
	//InitSegments();

	 //URL is http://www.example.com/mypage?ref=registration&email=bobo@example.com

	$.urlParam = function (name) {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}

	LoadSegmentsFromJSON($.urlParam('level'));
	//SegmentsToJSON();
	
}

// the main update loop ( called 60 times a second)
function MainUpdateLoop(){
	
	// clear the canvas for a before it is redrawn
	ctx.clearRect(0, 0, game.width, game.height);
	
	// calls the update for the bar and ball
	UpdateBar();
	UpdateBall();

	
	// calls the main draw procedure
	Draw();

	// recall the main update loop
	requestAnimationFrame(MainUpdateLoop);
}

// ties an event to caputre the coordinates of the mouse every time it moves within the canvaas
game.addEventListener("mousemove", GetMouseCoords);
function GetMouseCoords(evt){

	mouseCoords = new Victor(evt.clientX - game.offsetLeft,evt.clientY - game.offsetTop);

	
}


"use strict";

ctx.font = "12px Verdana";

var FPS = 60;

var Time = {
	divisor : 1000,

	date : new Date(),
	startTime : 0,
	time : 0,
	deltaTime : 0,
	lastTime : 0,
	timeElapsed : 0,

	function update(){
		this.date = new Date();
		this.time = this.date.getTime() / this.divisor;
		this.deltaTime = this.time - this.lastTime;
		this.timeElapsed = this.time - this.startTime;
		this.lastTime = this.time;
	}
}

var mousePos = new Vector2(0, 0);

function updateMousePos(event){
	event = event || window.event;
	if (event.offsetX){
		mousePos = new Vector2(event.offsetX, event.offsetY);
	}
	else if (event.layerX){
		mousePos = new Vector2(event.layerX, event.layerY);
	}
}

window.onmousemove = updateMousePos;

function drawRotatedImage(image, pos, angle){
	//This function shamelessly stolen from Seb Lee-Delisle of http://creativejs.com/
 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 
 
	// move to the middle of where we want to draw our image
	ctx.translate(pos[0], pos[1]);
 
	ctx.rotate(angle);
 
	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame    ||
          	function( callback ){
          		window.setTimeout(callback, 1000 / FPS);
          	};
})();

var Key = {
	_pressed: {},
	
	TAB : 9,
	
	ENTER : 13,
	ALT : 18,

	LEFT  : 37,
	UP    : 38,
	RIGHT : 39,
	DOWN  : 40,
	
	W : 87,
	A : 65,
	S : 83,
	D : 68,
	
	R : 82,

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	},
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
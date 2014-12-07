"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "72px Verdana";

var FPS = 60;

var d = new Date();
var startTime = d.getTime() / 1000;
var time;
var deltaTime;
var lastTime = startTime;
var timeElapsed;

function updateDeltaTime(){
	d = new Date();
	time = d.getTime() / 1000;
	deltaTime = time - lastTime;
	timeElapsed = time - startTime;
	lastTime = time;
}

var mousePos = new Vector2(0, 0);

function updateMousePos(event){
	var rect = canvas.getBoundingClientRect()

	mousePos[0] = event.clientX - rect.left;
	mousePos[1] = event.clientY - rect.top;
}

window.onmousemove = updateMousePos;

function drawRotatedImage(image, pos, angle){
	//This function shamelessly stolen from Seb Lee-Delisle of http://creativejs.com/
 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 
 
	// move to the middle of where we want to draw our image
	ctx.translate(pos[0], pos[1]);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
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
	SPACE : 32,

	LEFT  : 37,
	UP    : 38,
	RIGHT : 39,
	DOWN  : 40,
	
	W : 87,
	A : 65,
	S : 83,
	D : 68,

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

var facings = {
    LEFT : -1,
    RIGHT : 1,
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function Sprite(left_images, right_images, interval, switcher){
    this.left_images = left_images;
    this.right_images = right_images;
    this.interval = interval;
    this.timeUntilAnimate = this.interval;
    this.i = 0;
    this.animating = true;
    this.facing = facings.LEFT;
    
    this.switcher = switcher;
    this.direction = 1;
    
    this.image = this.facing == facings.LEFT ? this.left_images[this.i] : this.right_images[this.i];
    
    this.animate = function(override){
        this.image = this.facing == facings.LEFT ? this.left_images[this.i] : this.right_images[this.i];
        
        if (! this.animating && ! override){
            return;
        }
        
        this.i += 1 * this.direction;
        
        if (this.i >= (this.facing == facings.LEFT ? this.left_images : this.right_images).length || (this.i < 0 && this.direction == -1)){
            if (! this.switcher){
                this.i = 0;
            }
            else{
                this.direction *= -1;
                this.i += this.direction;
            }
        }
    }
    
    this.update = function(){        
        this.timeUntilAnimate -= deltaTime;
        
        if (this.timeUntilAnimate <= 0){
            this.animate();
            this.timeUntilAnimate = this.interval;
        }
    }
    
    this.draw = function(ctx, pos, rotation){
		if (rotation === undefined){
			ctx.drawImage(this.image, pos[0], pos[1]);
		}
		else{
			drawRotatedImage(this.image, pos, rotation);
		}
    }
    
    this.end = function(){
        window.endInterval(this.intervalID);
    }
}
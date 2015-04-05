var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "72px Verdana";

var WIDTH  =  canvas.width;
var HEIGHT = canvas.height;

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
	event = event || window.event;
	if (event.offsetX){
		mousePos = new Vector2(event.offsetX, event.offsetY);
	}
	else if (event.layerX){
		mousePos = new Vector2(event.layerX, event.layerY);
	}
}

window.onmousemove = updateMousePos;

var Key = {
	_pressed: {},
	
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

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	},
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

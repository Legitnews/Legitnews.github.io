var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "32px " + document.getElementById("font").face;

var fps = 60;

var title = document.getElementById("title");
var intermission = document.getElementById("intermission");
var music = document.getElementsByName("music");

var width  =  canvas.width;
var height = canvas.height;
	
var d = new Date();
var startTime = d.getTime() / 1000;
var time;
var deltaTime;
var lastTime = startTime;
var timeElapsed;

var mousePos = [0, 0];

var begin = false;
var setReset = false;

var level = 1;

window.onmousemove = updateMousePos;

function updateDeltaTime(){
	d = new Date();
	time = d.getTime() / 1000;
	deltaTime = time - lastTime;
	timeElapsed = time - startTime;
	lastTime = time;
}

function updateMousePos(event){
	event = event || window.event;
	if (event.offsetX){
		mousePos = [event.offsetX, event.offsetY];
	}
	else if (event.layerX){
		mousePos = [event.layerX, event.layerY];
	}
}

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

	lastPresses : [],
	
	konamiCode : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
	// Up, up, down, down, left, right, left, right, B, A

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
		this.lastPresses.push(event.keyCode);
		
		this.checkCode();
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	},
	
	checkCode : function(){
		if (this.lastPresses.length > this.konamiCode.length){
			this.lastPresses.shift();
		}
		
		if (arraysEqual(this.lastPresses, this.konamiCode)){
			Player.hose = true;
		}
	},
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function magnitude(vector){
	return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
}

var m;
function normalise(vector){
	m = magnitude(vector);
	
	if (m == 0){
		return vector;
	}
	
	return [vector[0] / m, vector[1] / m];
}

function fromRadians(rads){
	return [-Math.cos(rads), Math.sin(rads)];
}

var dx;
var dy;
function angleBetween(a, b){
	dx = a[0] - b[0];
	dy = a[1] - b[1];
	
	return fromRadians(Math.atan2(-dy, dx) % (2 * Math.PI));
}

function distanceBetween(a, b){
	dx = a[0] - b[0];
	dy = a[1] - b[1];
	
	return Math.sqrt(Math.abs(dx*dx + dy*dy));
}

function collideRect(a_pos, a_size, b_pos, b_size){
	if (a_pos[0] > (b_pos[0] + b_size[0]) || (a_pos[0] + a_size[0]) < b_pos[0]) return false;
	if (a_pos[1] > (b_pos[1] + b_size[1]) || (a_pos[1] + a_size[1]) < b_pos[1]) return false;
	return true;
}

function pointInRect(point, rectPos, rectSize){
	return (rectPos[0] < point[0] && point[0] < (rectPos[0] + rectSize[0]) &&
			 rectPos[1] < point[1] && point[1] < (rectPos[1] + rectSize[1]));
	
}

function strReplace(from, to, string, substring){
	if (to == undefined){
		to = from + substring.length;
	}
	
	return string.substr(0, from) + substring + string.substr(to);
}


var r, g, b, h, i, f, q;

function rainbow(numOfSteps, step) {
	// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
	// Adam Cole, 2011-Sept-14
	// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	h = step / numOfSteps;
	i = ~~(h * 6);
	f = h * 6 - i;
	q = 1 - f;
	switch(i % 6){
		case 0: r = 1, g = f, b = 0; break;
		case 1: r = q, g = 1, b = 0; break;
		case 2: r = 0, g = 1, b = f; break;
		case 3: r = 0, g = q, b = 1; break;
		case 4: r = f, g = 0, b = 1; break;
		case 5: r = 1, g = 0, b = q; break;
	}
	var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
	return (c);
}

var bullets = [];

var difficultyButtons = {
	pos : [0, 190],
	buttonSize : [128, 32],
	difficulties : {"Easy" :   1,
					"Normal" : 2,
					"Hard" :   3},
					
	selected   : "Normal",
	difficulty : 2,
	
	selectedColour   : "#00FF00",
	unselectedColour : "#000000",
		
	draw : function(){
		var y = this.pos[1];
		
		for (key in this.difficulties){
			if (key == this.selected){
				ctx.fillStyle = this.selectedColour;
			}
			else{
				ctx.fillStyle = this.unselectedColour;
			}
			ctx.fillText(key, this.pos[0], y + this.buttonSize[1]);
			
			y += this.buttonSize[1];
		}
	},
	
	onMouseDown : function(){
		var y = this.pos[1];
		
		for (key in this.difficulties){
			if (pointInRect(mousePos, [this.pos[0], y], this.buttonSize)){
				this.selected = key;
				this.difficulty = this.difficulties[this.selected];
			}
			
			y += this.buttonSize[1];
		}
	}
}

var modeButtons = {
	pos : [480, 220],
	buttonSize : [128, 32],
	modes : ["Classic", "Miami"],
					
	selected   : "Classic",
	
	selectedColour   : "#00FF00",
	unselectedColour : "#000000",
		
	draw : function(){
		var y = this.pos[1];
		
		for (i in this.modes){
			if (this.modes[i] == this.selected){
				ctx.fillStyle = this.selectedColour;
			}
			else{
				ctx.fillStyle = this.unselectedColour;
			}
			ctx.fillText(this.modes[i], this.pos[0], y + this.buttonSize[1]);
			
			y += this.buttonSize[1];
		}
	},
	
	onMouseDown : function(){
		var y = this.pos[1];
		
		for (i in this.modes){
			if (pointInRect(mousePos, [this.pos[0], y], this.buttonSize)){
				this.selected = this.modes[i];
			}
			
			y += this.buttonSize[1];
		}
	}
}

function runTitle(){
	if (level > 1){
		ctx.drawImage(intermission, 0, 0);
		ctx.fillStyle = "#000000";
		ctx.fillText("Level " + level, 250, 320)
	}
	else{
		ctx.drawImage(title, 0, 0);
		difficultyButtons.draw();
		modeButtons.draw();
	}
}

var Cursor = {
	radius : 4,
	width : 1,
	colour : "#FF0000",
	
	draw : function(){
		ctx.beginPath();
		ctx.arc(mousePos[0], mousePos[1], this.radius, 0, 2 * Math.PI, false);
		ctx.lineWidth = this.width;
		ctx.strokeStyle = this.colour;
		ctx.stroke();
	},
};

function Bullet(pos, dir){
	this.speed = 400;
	
	this.dead = false;
	
	this.pos = pos;
	this.size = [3, 3];
	this.direction = dir;
	
	this.colour = "#222222";
	
	this.draw = function(){
		if (this.dead){
			return;
		}
		
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
	};
	
	this.killIfOffscreen = function(){
		if (this.pos[0] < 0 || this.pos[0] > width || this.pos[1] < 0 || this.pos[1] > height){
			this.die();
		}
	};
	
	this.die = function(){	
		this.dead = true;
	};
	
	this.move = function(){
		this.pos[0] += this.direction[0] * this.speed * deltaTime;
		this.pos[1] += this.direction[1] * this.speed * deltaTime;
	};
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		this.move();
		this.killIfOffscreen();
	};
	
	this.collideBill = function(){
		for (i in bills){
			if (bills[i].dead || this.dead){
				continue;
			}
			
			if (collideRect(this.pos, this.size, bills[i].pos, bills[i].size)){
				return bills[i];
			}
		}
	};
}

var Player = {
	speed : 200,
	
	pos : [width / 2, height / 2],
	size  : [20, 20],
	direction : [0, 0],
	
	colour : "#DD0000",
	
	hose : false,
	
	handleKey : function(){
		if (Key.isDown(Key.LEFT) || Key.isDown(Key.A)){
			this.direction[0] = -1;
		}
		else if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D)){
			this.direction[0] = 1;
		}
		else{
			this.direction[0] = 0;
		}
		
		if (Key.isDown(Key.UP) || Key.isDown(Key.W)){
			this.direction[1] = -1;
		}
		else if (Key.isDown(Key.DOWN) || Key.isDown(Key.S)){
			this.direction[1] = 1;
		}
		else{
			this.direction[1] = 0;
		}
		
		this.direction = normalise(this.direction);
	},
	
	move : function(){
		this.pos[0] += this.direction[0] * this.speed * deltaTime;
		this.pos[1] += this.direction[1] * this.speed * deltaTime;
		this.centre = [this.pos[0] + this.size[0] / 2, this.pos[1]  + this.size[1] / 2];
	},
	
	draw : function(){
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
	},
	
	wrap : function(){
		if (this.pos[0] < 0){
			this.direction[0] = Math.abs(this.direction[0]);
			//this.pos[0] = width;
		}
		else if (this.pos[0] + this.size[0] > width){
			this.direction[0] = -Math.abs(this.direction[0]);
			//this.pos[0] = 0;
		}
		if (this.pos[1] < 0){
			this.direction[1] = Math.abs(this.direction[1]);
			//this.pos[1] = height;
		}
		else if (this.pos[1] + this.size[1] > height){
			this.direction[1] = -Math.abs(this.direction[1]);
			//this.pos[1] = 0;
		}
	},
	
	fire : function(){
		bullets.push(new Bullet(this.centre, angleBetween(this.centre, mousePos)));
	},
	
	update : function(){
		this.handleKey();
		this.wrap();
		this.move();
		
		if (this.hose){
			this.fire();
		}
	},
	
	reset : function(){
		this.pos = [width / 2, height / 2];
		this.direction = [0, 0];
	},
};

function onMouseDown(e){
	if (begin){
		Player.fire();
	}
	else{
		difficultyButtons.onMouseDown();
		modeButtons.onMouseDown();
	}
}

window.onmousedown = onMouseDown;

function Bill(i){
	this.speed = 150;
	
	this.madePos = false;
	this.minPlayerDist = 200;
	
	dead = false;
	
	this.pos = [Math.random() * width, Math.random() * height];
	this.direction = [0, 0];

	if (i == 0){
		this.health = 8 * difficultyButtons.difficulty;
		this.colour = "#0000DD";
		this.size = [25, 25];
	}
	else{
		this.health = Math.round(Math.random() * 4 * difficultyButtons.difficulty);
		this.colour = rainbow(numBills, i);
		this.size = [20, 20];
	}
	
	this.calcDirection = function(){
		this.direction = angleBetween(this.pos, Player.pos);
		
		this.direction[0] += Math.random();
		this.direction[1] += Math.random();
		
		this.direction = normalise(this.direction);
	};
	
	this.draw = function(){
		if (this.dead){
			return;
		}
		
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
	};
	
	this.wrap = function(){
		if (this.pos[0] < 0)
			this.pos[0] = width;
		else if (this.pos[0] > width)
			this.pos[0] = 0;
		if (this.pos[1] < 0)
			this.pos[1] = height;
		else if (this.pos[1] > height)
			this.pos[1] = 0;
	};
	
	this.move = function(){
		this.pos[0] += this.direction[0] * this.speed * deltaTime;
		this.pos[1] += this.direction[1] * this.speed * deltaTime;
	};
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		if (! this.madePos){
			while (distanceBetween(this.pos, Player.pos) < this.minPlayerDist){
				this.pos = [Math.random() * width, Math.random() * height];
			}
			this.madePos = true;
		}
		
		this.calcDirection();
		this.move();
		this.wrap();
		this.speed += deltaTime * difficultyButtons.difficulty;
	};
	
	this.damage = function(){
		this.health -= 1;
		
		if (this.health <= 0){
			this.die();
		}
	};
	
	this.die = function(){
		this.dead = true;
	};
	
	this.collidePlayer = function(){	
		return collideRect(Player.pos, Player.size, this.pos, this.size) && ! this.dead;
	};
}

var bills = [];
var numBills = 1;
var intervalID;

function allBillsDead(){
	for (i in bills){
		if (! bills[i].dead){
			return false;
		}
	}
	
	return true;
}

function reload(){
	Player.reset();
	
	bullets = [];
	bills = [];
	
	for (var i=0; i < numBills; i++){
		bills.push(new Bill(i));
	}
}

function start(){
	reload();
}

function update(){
	updateDeltaTime();
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (! begin){
		begin = Key.isDown(Key.ENTER);
		runTitle();
		
		if (begin) start();
		else Cursor.draw();
		
		return;
	}
	
	if (Key.isDown(Key.ALT)){
		ctx.fillText(Math.floor(1 / deltaTime), 0, 30);
	}
	
	for (i in bills){
		bills[i].update();
		bills[i].draw();
		
		if (bills[i].collidePlayer()){
			if (modeButtons.selected === "Classic"){ 
				alert("Game Over");
				document.cookie = null;
				location.reload();
			}
			else if (modeButtons.selected === "Miami"){
				reload();
			}
		}
	}
	
	if (allBillsDead() && ! setReset){
		setTimeout(main, 2000);
		setReset = true;
		
		level += 1;
		numBills = Math.ceil(numBills * 1.25);
	}
	
	Player.update();
	Player.draw();
	
	for (var i in bullets){
		bullets[i].update();
		bullets[i].draw();
		
		var bill = bullets[i].collideBill();
		
		if (bill){
			bill.damage();
			bullets[i].die();
		}
	}
	
	Cursor.draw();
}

function playMusic(){
	music[Math.floor(Math.random() * music.length)].play();
}

function main(){
	
	if (intervalID){
		window.clearInterval(intervalID);
	}
	
	begin = false;
	setReset = false;
	intervalID = window.setInterval(update, 1000 / fps);
}

for (var i=music.length-1; i >= 0; i--){
	music[i].addEventListener("ended", function(e){this.currentTime = 0; playMusic();}, false);
}
playMusic();
main();

/*
 * 
 */
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

function Leg(){
	Rect.call(this, [0, -400], [200, 600]);
	this.image = document.getElementById("leg");
	
	this.vertSpeed = 300;
	this.speed = 600;
	
	this.update = function(){
		if (Key.isDown(Key.DOWN) && this.pos[1] < 0){
			this.pos[1] += this.speed * deltaTime;
		}
		else if (this.pos[1] > -400 && ! Key.isDown(Key.DOWN)){
			this.pos[1] -= this.speed * deltaTime * 1.5;
		}
		
		if (Key.isDown(Key.LEFT) && this.pos[0] > 0 && this.pos[1] <= -400){
			this.pos[0] -= this.vertSpeed * deltaTime;
		}
		
		else if (Key.isDown(Key.RIGHT) && this.pos[0] + this.size[0] < canvas.width && this.pos[1] <= -400){
			this.pos[0] += this.vertSpeed * deltaTime;
		}
		
		for (var i=0; i < Game.dogs.length; i++){
			if(Game.dogs[i].collideRect(this) && Game.dogs[i].pos[1] + Game.dogs[i].size[1] / 2 > this.pos[1] + this.size[1] && ! Game.dogs[i].dead){
				Game.dogs[i].die();
			}
		}
	}
	
	this.draw = function(){
		ctx.drawImage(this.image, this.pos[0], this.pos[1] - 10);
	}
}

function Dog(spriteSet){
	Rect.call(this, [canvas.width + 45, canvas.height - (26 + Random.range(180))], [45, 26]);
	
	var running = new Animation([Game.dogSprites[0][spriteSet], Game.dogSprites[2][spriteSet], Game.dogSprites[1][spriteSet]], 3);
	this.animator = new Animator(["idle", "running"], [Game.dogSprites[3][spriteSet], running]);
	
	this.velocity = new Vector2(0, 0);
	this.acceleration = new Vector2(-20, 0);
	this.topSpeed = 300;
	
	this.dead = false;
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		this.animator.update(deltaTime);
		
		this.velocity.add(this.acceleration.copy().mul(deltaTime));
		
		var testRect = this.copy();
		testRect.pos[0] += this.velocity[0] * deltaTime;
		
		if (testRect.collideRect(Game.leg)){
			this.velocity[0] = 0;
		}
		
		this.pos.add(this.velocity.copy().mul(deltaTime));
		
		if (this.velocity[0] !== 0 && this.animator.state !== "running"){
			this.animator.setState("running");
		}
		
		else if (this.velocity[0] === 0 && this.animator.state !== "idle"){
			this.animator.setState("idle");
		}
		
		if (this.pos[0] < -this.size[0]){
			this.dead = true;
		}
	}
	
	this.draw = function(){
		if (this.dead){
			return;
		}
		
		this.animator.draw(ctx, this.pos);;
	}
	
	this.die = function(){
		this.dead = true;
		
		var numBloods = Random.range(12, 20); 
		
		for (var i=0; i < numBloods; i++){
			Game.blood.push(new Blood(this.pos.copy()));
		}
	}
}

function Blood(pos){
	this.g = new Vector2(0, 500);
	
	var initialSpeed = Random.range(200, 400);
	this.pos = pos;
	this.velocity = (new Vector2(Random.uniform(-.7, .7), -1)).scale(initialSpeed);
	
	this.radius = Random.range(1, 5);
	this.red = Random.range(128, 256);
	
	this.dead = false;
	
	this.update = function(){
		if (this.dead){
			return;
		}
		
		this.velocity.add(this.g.copy().mul(deltaTime));
		this.pos.add(this.velocity.copy().mul(deltaTime));
		
		if (this.pos[1] > canvas.height){
			this.dead = true;
		}
	}
	
	this.draw = function(ctx){
		if (this.dead){
			return;
		}
		
		ctx.fillStyle = "rgb(" + this.red + ", 0, 0)";
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

var Game = {
	
	started : true,
	dogRate : 2,
	
	music : document.getElementsByName("music"),
	currentSong : null,
	
	dogs : [],
	blood : [],
	
	intro : function(){
		
	},
	
	init : function(){
		this.intro();
		
		window.setInterval(function(){ Game.clearBlood(); }, 500);
		
		this.background = document.getElementById("background");
		
		var dogs = document.getElementById("dogs");
		this.dogSprites = new Tileset(dogs, [4, 4], [90, 52], 2);
		
		this.leg = new Leg();
		
		for (var i = this.music.length-1; i >= 0; i--){
			this.music[i].addEventListener("ended", function(e){this.currentTime = 0; Game.playMusic();}, false);
		}
		
		this.playMusic();
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}
		
		for (var i=0; i < this.dogs.length; i++){
			this.dogs[i].update(ctx);
		}
		for (var i=0; i < this.blood.length; i++){
			this.blood[i].update(ctx);
		}
		
		this.leg.update();
		
		if (Random.chance(deltaTime / this.dogRate)){
			this.addDog(0);
		}
		
		if (this.dogRate > .2){
			this.dogRate -= deltaTime / 200;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}
		
		ctx.drawImage(this.background, 0, 0);
		
		for (var i=0; i < this.dogs.length; i++){
			this.dogs[i].draw();
		}
		for (var i=0; i < this.blood.length; i++){
			this.blood[i].draw(ctx);
		}
		
		this.leg.draw();
		
	},
	
	addDog : function(spriteSet){
		this.dogs.push(new Dog(spriteSet));
		
		this.sortDogs();
	},
	
	sortDogs : function(){
		//Sort dogs by which is the furthest down, for perspective.
		
		var sorted = [];
		
		var y_values = [];
		
		// I really miss list comprehensions.
		
		for (var i=0; i < this.dogs.length; i++){
			y_values.push(this.dogs[i].pos[1]);
		}
		sorted_y_values = y_values.slice(0).sort();
		
		var j;
		
		for (var i=0; i < y_values.length; i++){
			 j = sorted_y_values.indexOf(y_values[i]);
			 sorted[j] = this.dogs[i];
			 
			 sorted_y_values[j] = null;
		}
		
		this.dogs = sorted;
	},
	
	clearBlood : function(){
		for (var i=0; i < this.blood.length; i++){
			if (! this.blood[i].dead){
				return;
			}
		}
		
		this.blood = [];
	},
	
	playMusic : function(){
		var song = this.music[Math.floor(Math.random() * this.music.length)];
		if (song !== this.currentSong || this.music.length === 1){
			song.play();
			this.currentSong = song;
		}
	},
}

function init(){
	Game.init();
}

function update(){
	updateDeltaTime();
	Game.update();
}

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	Game.render();
}

function main(){
	console.time('init timer');
	init();
	console.timeEnd('init timer');
	
	window.setInterval(update, 5);
	
	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

setTimeout(main, 100);

var arrowImage = document.getElementById("ArrowImage");

function CursorArrow(pos){
	this.image = arrowImage;
	this.pos = pos ? pos : new Vector2(Math.random() * WIDTH, 300);
	this.centre = new Vector2(this.pos[0] + this.image.width / 2, 
							   this.pos[1] + this.image.height / 2);
	this.angleTo = this.centre.angleTo(mousePos);
	this.angleTo.mul(-1);
	this.rotation = toRadians(this.angleTo);
	
	this.update = function(){
		this.angleTo = this.centre.angleTo(mousePos);
		this.angleTo.mul(-1);
		this.rotation = toRadians(this.angleTo);
	};
	
	this.draw = function(){
		ctx.save();
		
		var midX = (this.image.width) / 2;
		var midY = (this.image.height) / 2;
		
		ctx.translate(this.pos[0], this.pos[1]);
		ctx.translate(midX, midY);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, -midX, -midY);
		
		ctx.restore();
	};
	
	this.fire = function(){
		var dir = this.angleTo.copy();
		dir[1] *= -1;
		bullets.push(new Bullet(this.centre.copy(), dir));
	}
}

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
		if (this.pos[0] < 0 || this.pos[0] > WIDTH || this.pos[1] < 0 || this.pos[1] > HEIGHT){
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
}

var arrows = [];
var bullets = [];

for (var i=0; i < 10; i++){
	arrows.push(new CursorArrow());
}

function onMouseDown(e){
	if (e.button == 0){
		for (i in arrows){
			arrows[i].fire();
		}
	}
	else if (e.button == 2){
		var pos = mousePos.copy();
		var offset = new Vector2(arrowImage.width, arrowImage.height);
		offset.div(2);
		pos.sub(offset);
		
		arrows.push(new CursorArrow(pos));
	}
}

window.onmousedown = onMouseDown;

function update(){
	updateDeltaTime();
	
	for (i in arrows){
		arrows[i].update();
	}
	
	for (i in bullets){
		bullets[i].update();
	}
}

function render(){
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	for (i in arrows){
		arrows[i].draw();
	}
	
	for (i in bullets){
		bullets[i].draw();
	}
	
	ctx.fillText(Math.ceil(1 / deltaTime), 0, 72);
}

var intervalID = window.setInterval(render, 1000 / FPS);
var intervalID = window.setInterval(update, 5);


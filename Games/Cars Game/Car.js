function getKeyBinds(keyMode){
	if (keyMode === "Arrows"){
		return {"up" : Key.UP,
				"down" : Key.DOWN,
				"right" : Key.RIGHT,
				"left" : Key.LEFT};
	}
	
	else if (keyMode === "WASD"){
		return {"up" : Key.W,
				"down" : Key.S,
				"right" : Key.D,
				"left" : Key.A};
	}
	
	else if (keyMode === "IJKL"){
		return {"up" : Key.I,
				"down" : Key.K,
				"right" : Key.L,
				"left" : Key.J};
	}
	
	else if (keyMode === "Numpad"){
		return {"up" : Key.NUMPAD_8,
				"down" : Key.NUMPAD_2,
				"right" : Key.NUMPAD_6,
				"left" : Key.NUMPAD_4};
	}
}

function Car(keyMode, pos, colour, size){
	Rect.call(this, pos, size, colour);
	
	this.velocity = new Vector2(0, 0);
	this.acceleration = new Vector2(0, 0);
	this.rotation = 0; //Radians.
	
	this.maxSpeed = 200;
	this.maxAngular = 10;
	this.minTurnVelocity = 20;
	
	this.collider = new Rect([this.pos[0] - this.size[0] / 2, this.pos[1] - this.size[1] / 4], [this.size[0], this.size[0]]);
	
	this.friction = 400;
	
	this.keyMode = keyMode;
	
	this.keyBinds = getKeyBinds(this.keyMode);
					 
	this.directions = {"up" : Vector2.UP,
					   "down" : Vector2.DOWN,
					   "right" : Vector2.RIGHT,
					   "left" : Vector2.LEFT,};
					   
	this.image = document.createElement("canvas");
	this.image.width = this.size[0];
	this.image.height = this.size[1];
	var _ctx = this.image.getContext("2d");
	_ctx.fillStyle = this.colour;
	_ctx.fillRect(0, 0, this.size[0], this.size[1]);
	_ctx.fillStyle = "#000000";
	_ctx.fillRect(this.size[0] * .1, this.size[1] * .1, this.size[0] * .8, this.size[1] * .35)
		
	this.update = function(colliders){
		this.velocity[1] = -100;
		
		this.handleKeyInput();
		
		this.velocity.add(this.acceleration.copy().mul(deltaTime));
		this.applyFriction();
		
		if (this.velocity[1] > this.maxSpeed){
			this.velocity[1] = this.maxSpeed;
		}
		
		if (this.velocity[0] > this.maxAngular){
			this.velocity[0] = this.maxAngular;
		}
		
		if (Math.abs(this.velocity[1]) >= this.minTurnVelocity){
			this.rotation += this.velocity[0] * deltaTime;
			if (this.rotation > Math.PI){
				 this.rotation = this.rotation - Math.PI * 2;
			}
			else if (this.rotation < Math.PI){
				 this.rotation = this.rotation + Math.PI * 2;
			}
		}
		
		var delta = Vector2.UP.copy().rotate(this.rotation).mul(-this.velocity[1] * deltaTime);
		
		if (! this.checkCollision(delta, colliders)){
			this.pos.add(delta);
			this.collider.pos.add(delta);
		}
		else{
			this.acceleration.mul(0);
		}
		
		this.wrap();
		
	};
	
	this.draw = function(ctx){
		drawRotatedImage(this.image, this.pos, this.rotation);
	}
	
	this.checkCollision = function(delta, colliders){
		test = this.collider.copy();
		test.pos.add(delta);
		
		for (i in colliders){
			if (colliders[i] !== this.collider && test.collide(colliders[i])){
				return true;
			}
		}
		
		return false;
	}
	
	this.wrap = function(){
		if (this.pos[0] < 0){
			this.pos[0] = canvas.width;
		}
		else if (this.pos[0] > canvas.width){
			this.pos[0] = 0;
		}
		else if (this.pos[1] < 0){
			this.pos[1] = canvas.height;
		}
		else if (this.pos[1] > canvas.height){
			this.pos[1] = 0;
		}
		
		this.collider.pos[0] = this.pos[0] - this.size[0] / 2;
		this.collider.pos[1] = this.pos[1] - this.size[1] / 4;
	}
	
	this.handleKeyInput = function(){
		if (Key.isDown(this.keyBinds["up"])){
			this.acceleration.add(this.directions["up"]);
		}
		
		else if (Key.isDown(this.keyBinds["down"])){
			this.acceleration.add(this.directions["down"]);
		}
		
		else{
			this.acceleration[1] = 0;
		}
		if (Math.abs(this.velocity[1]) >= this.minTurnVelocity){
			if (Key.isDown(this.keyBinds["right"])){
				this.velocity[0] += deltaTime;
			}
			
			else if (Key.isDown(this.keyBinds["left"])){
				this.velocity[0] -= deltaTime;
			}
			
			else{
				this.acceleration[0] = 0;
				this.velocity[0] = 0;
			}
		}
		
		else{
				this.acceleration[0] = 0;
				this.velocity[0] = 0;
			}
	};
	
	this.applyFriction = function(){
		if (! this.velocity.equals(Vector2.ZERO)){
			var frictional = this.velocity.copy().scale(this.friction * deltaTime);
			
			this.velocity[1] -= frictional[1] * (Math.abs(this.velocity[1]) / this.maxSpeed);
		}
	}
}

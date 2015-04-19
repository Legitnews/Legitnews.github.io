function Player() {
	PhysicsObject.call(this, this, [0, 0])

	this.speed = 60;
	this.jumpSpeed = -150;
	this.colour = "#500000";

	this.size = new Vector2(24, 24);

	Rect.call(this, this.pos, this.size, this.colour)

	this.axes = new Vector2(0, 0);

	this.latentVel = new Vector2(0, 0);

	this.canJump = true;

	this.basePos = new Vector2(0, 0);

	//this.hitY = null;

	this.update = function(deltaTime){

	}

	this.onPhysicsStep = function(deltaTime){
		this.velocity.x = this.latentVel.x + this.axes.x * this.speed;

		if (this.axes[1] < 0){
			this.jump();
		}
	}

	this.postPhysicsStep = function(){
	}

	this.onCollisionX = function(tile){

	}
	this.onCollisionY = function(tile){
		if (this.velocity.y > 0){
			this.canJump = true;
		}
	}

	this.jump = function(){
		if (! this.canJump){
			return;
		}

		this.velocity.y -= this.jumpSpeed * this.axes[1];
		this.canJump = false;
	}

	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y)
	}

	this.handleInput = function(key, gamepad){
		if (gamepad !== null){
			this.axes.x = gamepad.axes[0];
			this.axes.y = gamepad.axes[1];
		}

		else{

			if (key.isDown(key.LEFT) || key.isDown(key.A)){
				this.axes.x = -1;
			}
			else if (key.isDown(key.RIGHT) || key.isDown(key.D)){
				this.axes.x = 1;
			}
			else{
				this.axes.x = 0;
			}
			if (key.isDown(key.UP) || key.isDown(key.W)){
				this.axes.y = -1;
			}
			else if (key.isDown(key.DOWN) || key.isDown(key.S)){
				this.axes.y = 1;
			}
			else{
				this.axes.y = 0;
			}
		}
	}
}
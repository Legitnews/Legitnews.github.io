var countdownTime;

function Ball(){
	Circle.call(this, [WIDTH / 2, HEIGHT / 2], 5, "#000000");
	
	this.velocity = new Vector2(280 * [-1, 1][Math.round(Math.random())], 0);
	this.lastPaddleHit = null;
	
	this.move = function(){
		var delta = this.velocity.copy();
		delta.mul(deltaTime);
		this.centre.add(delta);
	}
	
	this.update = function(){
		this.move();
		
		var collide = this.checkCollision();
		if (collide[0]) this.velocity[0] *= -1;
		if (collide[1]) this.velocity[1] *= -1;
	}
	
	this.checkCollision = function(){
		var xTest = this.copy();
		var yTest = this.copy();
		
		var delta = this.velocity.copy();
		delta.mul(deltaTime);
		
		xTest[0] += delta[0];
		yTest[1] += delta[1];
		
		var colliding = [false, false];
		
		for (i in paddles){
			if (xTest.collideRect(paddles[i])){
				colliding[0] = true;
				this.lastPaddleHit = paddles[i];
				m = this.velocity.magnitude();
				
				this.velocity = this.centre.angleTo(new Vector2(paddles[i].pos[0] + paddles[i].size[0] / 2,
																 paddles[i].pos[1] + paddles[i].size[1] / 2));
				this.velocity[1] *= -1
				this.velocity.scale(m);
				this.velocity.mul((this.player == 1) ? 1.1 : -1.1);
				
				//this.velocity.rotate(Math.PI * (((paddles[i].pos[0] + paddles[i].size[0] / 2) - this.centre[0]) / (paddles[i].pos[0] + paddles[i].size[0] / 2)) * (this.player == 1) ? -1 : 1);
			}
			if (yTest.collideRect(paddles[i])){
				this.lastPaddleHit = paddles[i];
				colliding[1] = true;
			}
		}
		
		for (i in balls){
			if (balls[i] === this) continue;
			
			if (xTest.collideCircle(paddles[i])){
				colliding[0] = true;
			}
			if (yTest.collideCircle(paddles[i])){
				colliding[1] = true;
			}
		}
		
		if (xTest.centre[0] + this.radius < 0){
			for (i in paddles){
				if (paddles[i].player == 1) paddles[i].score++
			}
			resetBall();
		}
		
		if (yTest.centre[0] - this.radius > WIDTH){
			resetBall();
			for (i in paddles){
				if (! paddles[i].player || paddles[i].player == 2) paddles[i].score++
			}
		}
		
		if (yTest.centre[1] < 0 || yTest.centre[1] > HEIGHT) colliding[1] = true;
		
		return colliding;
		
	}
}

function Paddle(player){
	var size = [10, 100];
	
	Rect.call(this, [WIDTH * ((player == 1) ? 1/8 : 7/8), (HEIGHT - size[1]) / 2], size, (player == 1) ? "#FF0000" : "#0000FF")
		
	this.player = player;
	this.speed = 200;
	this.direction = new Vector2(0, 0);
	
	this.score = 0;
	
	this.move = function(){
		var delta = this.direction.copy();
		delta.mul(this.speed * deltaTime);
		this.pos.add(delta);
	}
	
	this.drawScore = function(){
		ctx.fillStyle = "#000000";
		ctx.fillText(this.score, WIDTH * ((player == 1) ? (1/5) : (4/5)) -32, 54);
	}
	
	this.handleKeyP1 = function(){	
		if (Key.isDown(Key.UP)){
			this.direction[1] = -1;
		}
		else if (Key.isDown(Key.DOWN)){
			this.direction[1] = 1;
		}
		else{
			this.direction[1] = 0;
		}
		
		this.direction.normalise();
	}
	
	this.handleKeyP2 = function(){	
		if (Key.isDown(Key.W)){
			this.direction[1] = -1;
		}
		else if (Key.isDown(Key.S)){
			this.direction[1] = 1;
		}
		else{
			this.direction[1] = 0;
		}
		
		this.direction.normalise();
	}
	
	this.ai = function(){
		var target;
		
		if (balls.length > 0) target = balls[0].centre; 
		else target = new Vector2(this.pos[0], HEIGHT / 2);
		var centre = new Vector2(this.pos[0] + this.size[0] / 2, this.pos[1] + this.size[1] / 2);
		
		var dist = target[1] - centre[1];
		
		if (Math.abs(dist) < 5 || balls.length < 1){
			this.direction = ZERO;
			return;
		}
		
		this.direction = centre.angleTo(target);
		this.direction[0] = 0;
		this.direction.normalise();
		
		if (this.collideCircle(balls[0])){
			this.direction.mul(-1);
		}
	}
	
	this.update = function(){
		this.drawScore();
		
		if (this.player == 1){
			this.handleKeyP1();
		}
		else if (this.player == 2){
			this.handleKeyP2();
		}
		else{
			this.ai();
		}
		this.move();
	}
}
if (window.confirm("2 Player?")){
	var paddles = [new Paddle(1), new Paddle(2)];
}
else{
	var paddles = [new Paddle(1), new Paddle(0)];
}	

var balls = [];
resetBall();

function resetBall(){
	balls = [];	
	
	countdownTime = 3;
	setTimeout(function(){balls.push(new Ball())}, countdownTime * 1000);
}

function countdown(i){
	countdownTime -= deltaTime;
	ctx.fillStyle = "#000000";
	ctx.fillText(Math.ceil(countdownTime), WIDTH / 2 - 32, 72);
}

function update(){
	updateDeltaTime();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	
	for (i in balls){
		balls[i].update();
		balls[i].draw(ctx);
	}
	
	for (i in paddles){
		paddles[i].update();
		paddles[i].draw(ctx);
	}
	
	if (balls.length == 0){
		countdown();
	}
}

var intervalID = window.setInterval(update, 1000 / FPS);

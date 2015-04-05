/*
 * 
 */
 
"use strict";

function Ball(canvas){
	this.canvas = canvas;

	this.speed = 500;

	this.pos = [this.canvas.width / 2, this.canvas.height / 2];
	this.velocity = [0, 0];
	this.velocity[0] = Math.random() * this.speed;
	this.velocity[1] = Math.sqrt(this.speed * this.speed - this.velocity[0] * this.velocity[0]);

	this.colour = "#FF0000";
	this.radius = 15;

	this.lastXCollideFrame = 0;
	this.lastYCollideFrame = 0;

	this.update = function(deltaTime, frameCount){
		this.pos[0] += this.velocity[0] * deltaTime;
		this.pos[1] += this.velocity[1] * deltaTime;

		if (this.lastXCollideFrame + 10 < frameCount){
			if (this.pos[0] - this.radius <= 0){
				this.lastXCollideFrame = frameCount;
				this.velocity[0] *= -1;
			}

			else if (this.pos[0] + this.radius >= this.canvas.width){
				this.lastXCollideFrame = frameCount;
				this.velocity[0] *= -1;
			}
		}
		if (this.lastYCollideFrame + 10 < frameCount){

			if (this.pos[1] - this.radius <= 0){
				this.lastYCollideFrame = frameCount;
				this.velocity[1] *= -1;
			}

			else if (this.pos[1] + this.radius >= this.canvas.height){
				this.lastYCollideFrame = frameCount;
				this.velocity[1] *= -1;
			}
		}
	}

	this.draw = function(ctx){
		ctx.beginPath();

		ctx.strokeStyle = "#000000";
		ctx.strokeWidth = 3;
		ctx.fillStyle = this.colour;

		ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI);

		ctx.fill();
		ctx.stroke();
	}
}

function Anim(FPS, canvas){
	
	this.FPS = FPS;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");

	this.frameCount = 0;

	this.ctx.font = "32px Verdana";
	
	this.d = new Date();
	this.startTime = this.d.getTime() / 1000;
	this.t = 0;
	this.deltaTime = 0;
	this.lastTime = this.startTime;
	this.timeElapsed = 0;

	this.ball = new Ball(this.canvas);

	this.updateDeltaTime = function(){
		this.d = new Date();
		this.t = this.d.getTime() / 1000;
		this.deltaTime = this.t - this.lastTime;
		this.timeElapsed = this.t - this.startTime;
		this.lastTime = this.t;
	}

	this.update = function(){
		this.frameCount++;

		this.updateDeltaTime();
		this.ball.update(this.deltaTime, this.frameCount);

		this.ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.ball.draw(this.ctx);

		this.ctx.fillStyle = "#000000";
		this.ctx.fillText(this.FPS + "(" + Math.round(1/this.deltaTime) + ")", 0, 32);
	}
}

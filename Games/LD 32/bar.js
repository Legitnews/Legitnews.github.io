function Bar(){
	Rect.call(this, [500, 40], [50, 400], "rgba(0, 0, 0, .5)");
	this.outlineColour = "#000000";
	this.outlineWidth = 10;

	this.upperDanger = .1;
	this.lowerDanger = .4;
	this.dangerSpreadRate = .008;
	this.timeToWin = 20;
	this.dangerColour = "rgba(255, 0, 0, .5)"

	this.cursorStart = .5;
	this.cursorOutlineWidth = 5;
	this.cursor = new Circle([this.pos.x + this.size.x / 2, this.pos.y + this.size.y * this.cursorStart], (this.size.x - this.outlineWidth - this.cursorOutlineWidth) / 2, "#00FF00");

	this.cursorFallrate = .2;
	this.cursorJumpRate = -.4;

	this.cursorMoveRate = this.cursorFallrate;

	this.cursorJumpTime = .15;
	this.cursorJumpTimeLeft = 0;

	this.handledPress = false;

	this.started = false;
	this.over = false;

	this.update = function(deltaTime){
		if (!this.started || this.over){
			return;
		}

		if (this.timeToWin <= 0){
			Game.onWin();
			this.over = true;
			return;
		}

		this.cursorJumpTimeLeft -= deltaTime;

		if (this.cursorJumpTimeLeft <= 0){
			this.cursorMoveRate = this.cursorFallrate;
		}

		this.upperDanger += this.dangerSpreadRate * deltaTime;
		this.lowerDanger += this.dangerSpreadRate * deltaTime;


		if (this.cursor.centre.y + this.cursor.radius - this.cursorOutlineWidth < this.pos.y + this.size.y - this.outlineWidth){
			this.cursor.centre.y += this.cursorMoveRate * this.size.y * deltaTime;
		}

		this.timeToWin -= deltaTime;

		if (this.checkLose()){
			this.onLose();
		}
	}

	this.draw = function(ctx){
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);

		ctx.fillStyle = this.dangerColour;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1] * this.upperDanger);
		ctx.fillRect(this.pos[0], this.pos[1] + this.size[1] * (1-this.lowerDanger), this.size[0], this.size[1] * this.lowerDanger);

		this.cursor.draw(ctx);
		this.cursor.draw(ctx, this.cursorOutlineWidth, "#000000");

		ctx.lineWidth = this.outlineWidth;
		ctx.strokeStyle = this.outlineColour;
		ctx.strokeRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
	};

	this.handleInput = function(key){
		if (key.isDown(key.SPACE) && this.cursorJumpTimeLeft <= 0 && !this.handledPress){
			this.cursorJumpTimeLeft = this.cursorJumpTime;
			this.cursorMoveRate = this.cursorJumpRate;
			this.handledPress = true
			this.started = true;

			Game.onPress();
		}
		else if (!key.isDown(key.SPACE)){
			this.handledPress = false;
		}
	}

	this.checkLose = function(){

		return (
			   		(this.cursor.centre.y - this.cursor.radius < this.pos[1] + this.size[1] * this.upperDanger) ||
					(this.cursor.centre.y + this.cursor.radius > this.pos[1] + this.size[1] * (1-this.lowerDanger))
			   );
	}

	this.onLose = function(){
		this.over = true;
		Game.onLose();
	}
}
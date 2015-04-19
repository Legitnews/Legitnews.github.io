function Clock(){
	this.d = new Date();
	this.startTime = this.d.getTime() / 1000;
	this.time;
	this.deltaTime;
	this.lastTime = this.startTime;
	this.timeElapsed;

	this.tick = function(){
		this.d = new Date();
		this.time = this.d.getTime() / 1000;
		this.deltaTime = this.time - this.lastTime;
		this.timeElapsed = this.time - this.startTime;
		this.lastTime = this.time;

		return deltaTime;
	}
}

var PhysicsManager = {
	g : new Vector2(0, 150),

	clock : new Clock(),

	objects : [],
	grid : null,

	collidableTiles : [0, 1],

	rate : 5,

	epsilon : 0.001,

	setGrid : function(grid){
		this.grid = grid;
	},

	collideGridRect : function(rect){
		var start = this.grid.pxToTileCoords(rect.pos);
		var end = this.grid.pxToTileCoords(rect.pos.copy().add(rect.size));

		/*for (var i=0; i < this.grid.size[0]; i++){
			for(var j=0; j < this.grid.size[1]; j++){
				if (this.grid.tileTypes[i][j] == 2)
					this.grid.tileTypes[i][j] = -1;
				else if (this.grid.tileTypes[i][j] == 1){
					this.grid.tileTypes[i][j] = 0;
				}
			}
		}*/

		if (start[0] > this.grid.size[0] || start[1] > this.grid.size[1] || end[0] < 0 || end[1] < 0){
			return
		}

		for (var i=start[0]; i <= end[0]; i++){
			for(var j=start[1]; j <= end[1]; j++){
				if (i > this.grid.size[0] || j > this.grid.size[1] || i < 0 || j < 0){
					continue;
				}
				
				/*if (this.grid.tileTypes[i][j] == -1 || this.grid.tileTypes[i][j] == 2)
					this.grid.tileTypes[i][j] = 2;
				else{
					this.grid.tileTypes[i][j] = 1;
				}*/

				if (this.collidableTiles.indexOf( this.grid.tileTypes[i][j] ) !== -1){
					return [i, j];
				}
			}	
		}
	},

	collideGrid : function(physObject){
		if (physObject.collider instanceof Rect){
			return this.collideGridRect(physObject.collider);
		}
	},

	update : function(){
		this.clock.tick();

		for(var i = this.objects.length-1; i >= 0; i--){
			this.objects[i].physicsUpdate(this.clock.deltaTime);
		}
	},

	start : function(){
		window.setInterval(function(){ PhysicsManager.update(); }, this.rate);
	}
}

function PhysicsObject(collider, pos){
	PhysicsManager.objects.push(this);

	this.collider = collider;

	this.pos = new Vector2(pos[0], pos[1]);
	this.velocity = new Vector2(0, 0);

	this.useGravity = true;
	this.fixed = false;

	this.physicsUpdate = function(deltaTime){
		this.onPhysicsStep(deltaTime);

		if (this.fixed){
			return;
		}

		if (this.useGravity){
			this.velocity.add(PhysicsManager.g.copy().mul(deltaTime));
		}

		this.pos[0] += this.velocity[0] * deltaTime;

		var checkMove = this.checkMove();

		if (checkMove){
			this.onCollisionX(checkMove);

			if (this.velocity.x < 0){
				this.pos.x = PhysicsManager.grid.tileToPxCoords(checkMove)[0] + PhysicsManager.grid.tileSize[0] + PhysicsManager.epsilon;
			}

			else if (this.velocity.x > 0){
				this.pos.x = PhysicsManager.grid.tileToPxCoords(checkMove)[0] - this.size.x - PhysicsManager.epsilon;;
			}

			this.velocity.x = 0;
		}

		this.pos[1] += this.velocity[1] * deltaTime;
		checkMove = this.checkMove();

		if (checkMove){
			this.onCollisionY(checkMove);

			if (this.velocity.y < 0){
				this.pos.y = PhysicsManager.grid.tileToPxCoords(checkMove)[1] + PhysicsManager.grid.tileSize[1] + PhysicsManager.epsilon;
			}

			else if (this.velocity.y > 0){
				this.pos.y = PhysicsManager.grid.tileToPxCoords(checkMove)[1] - this.size.y - PhysicsManager.epsilon;
			}

			this.velocity.y = 0;
		}

		this.postPhysicsStep();
	}

	this.onPhysicsStep = function(deltaTime){

	}
	this.postPhysicsStep = function() {
		
	}

	this.onCollisionX = function(tile){

	}
	this.onCollisionY = function(tile){
		
	}

	this.checkMove = function(){
		//var rectX = this.collider.copy();
		//var rectY = this.collider.copy();

		//rectX.pos[0] += this.velocity[0] * deltaTime;
		//rectY.pos[1] += this.velocity[1] * deltaTime;

		return PhysicsManager.collideGridRect(this.collider);
	}
}


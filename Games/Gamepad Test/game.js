/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

window.addEventListener("gamepadconnected", function(e) {
   Game.setGamepad(e.gamepad);
});

var Game = {
	
	started : true,
	gamepad : null,

	player : null,
	
	intro : function(){
		
	},
	
	init : function(){

		this.player = new Player();
		this.grid = new GameGrid();

		PhysicsManager.setGrid(this.grid);
		PhysicsManager.start();
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}

		this.player.update(deltaTime);
		this.player.handleInput(Key, this.gamepad);
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}
		
		this.grid.fill(ctx);
		this.player.draw(ctx);

		//ctx.fillText(Math.round(1 / deltaTime), 100, 100);
	},

	setGamepad : function(gamepad){
		this.gamepad = gamepad;
	},

	scroll : function(delta) {
		this.grid.topleft.add(delta);

		if (Key.isDown(Key.ALT)){
			console.log(delta);
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
	window.setInterval(render, 5);
	
	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

setTimeout(main, 100);

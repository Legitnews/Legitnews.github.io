/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : false,
	
	screenSize : null,
	intToTileRender : {1 : "#888888"},
	grid : null,
	
	objects : [],
	
	intro : function(){
		ctx.drawImage(title, 0, 0);
	},
	
	init : function(){
		this.intro();
		
		AnimationThread.start();
		
		this.screenSize = new Vector2(canvas.width, canvas.height);
		this.grid = new Grid(new Vector2(0, 0), new Vector2(canvas.width / 20, canvas.height / 20), new Vector2(20, 20), canvas, -1, this.intToTileRender);
		
		var filledRows = 5;
		
		for (var i = this.grid.tileTypes.length-1; i >= 0; i--){
			for (var j = this.grid.tileTypes[i].length - (filledRows); j < this.grid.tileTypes[i].length; j++){
				this.grid.tileTypes[i][j] = 1;
			}
		}
		
		this.objects.push(new Player());
		
		window.onmousedown = function(e){ Game.onClick(e); };
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}
		
		for (var i = this.objects.length-1; i >= 0; i--){
			this.objects[i].update();
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}
		
		this.grid.fillTiles(ctx);
		
		for (var i = this.objects.length-1; i >= 0; i--){
			this.objects[i].draw();
		}
	},
	
	onClick : function(e){
		
		if (e.button === 0){
			
		}
		
		else if (e.button === 2){
			var tile = this.grid.pxToTileCoords(mousePos);
			
			alert(tile);
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

/*
 * 
 */
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : true,
	
	intro : function(){
		
	},
	
	init : function(){
		this.intro();
		
		AnimationThread.start();
		
		this.tilesetRaw = document.getElementById("tileset");
		this.tileset = new Tileset(this.tilesetRaw, [16, 16], [48, 48], 1);
		
		var waterTile = new Animation([this.tileset[0][0], this.tileset[0][1], this.tileset[0][2], this.tileset[0][3], this.tileset[0][4]], 3);
		
		var intToTileRender = {0  : waterTile,
							   1  : this.tileset[1][0],
							   2  : this.tileset[1][1],
							   3  : this.tileset[1][2],
							   4  : this.tileset[1][3],
							   5  : this.tileset[1][4],
							   6  : this.tileset[1][5],
							   7  : this.tileset[1][6],
							   8  : this.tileset[1][7],
							   9  : this.tileset[1][8],
							   10 : this.tileset[1][9],
							   11 : this.tileset[1][10],
							   12 : this.tileset[1][11],
							   13 : this.tileset[1][12],
							   14 : this.tileset[1][13],
							   15 : this.tileset[1][14],
							   16 : this.tileset[1][15],
							   };
		
		this.grid = new Grid([0, 0], [25, 15], [48, 48], canvas, 0, intToTileRender);
		
		for (var i=0; i < this.grid.size[0]; i++){
			for(var j=0; j < this.grid.size[1]; j++){
				this.grid.tileTypes[i][j] = Random.choice([0, 1]);
			}
		}
		
		Game.grid.tileContext(1, 0, {"1111" : 2,
									 "1000" : 3,
									 "0100" : 4,
									 "0010" : 5,
									 "0001" : 6,
									 "1100" : 7,
									 "1010" : 8,
									 "1001" : 9,
									 "0101" : 10,
									 "0110" : 11,
									 "0011" : 12,
									 "1110" : 13,
									 "1011" : 14,
									 "1101" : 15,
									 "0111" : 16,
									 });
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}
		
		this.grid.fillTiles(ctx);
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

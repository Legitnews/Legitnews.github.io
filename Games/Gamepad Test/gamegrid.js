var intToTileRender = {
	0 : "#0000FF",
	1 : "#00FF00",
	2 : "#FF0000"
}

function GameGrid(){
	Grid.call(this, [0, 0], [200, 20], [32, 32], canvas, -1, intToTileRender);

	for (var i=this.size[0]-1; i >= 0; i--){
		for (var j=this.size[1]-1; j >= 0; j--){

			if (Math.random() < .3){
				this.tileTypes[i][j] = 0;
			}

		}
	}

	this.fill = function(ctx){
		this.fillTiles(ctx);

		for (var i=0; i < this.size[0]; i++){
			for(var j=0; j < this.size[1]; j++){
				
			}
		}
	}
}
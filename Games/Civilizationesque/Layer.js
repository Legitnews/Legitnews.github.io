function LayerManager(){
	this.terrainLayer = new TerrainLayer();
}

function Layer(game, topleft, gridSize, tileSize, defualtTile, intToTileRender){
	this.game = game;
	
	Grid.call(this, topleft, gridSize, tileSize, game.canvas, defualtTile, intToTileRender);
}

function TerrainLayer(game, topleft, gridSize, tileSize){
	var intToTileRender = {};
	
	Layer.call(game, topleft, gridSize, tileSize, -1, intToTileRender);
}

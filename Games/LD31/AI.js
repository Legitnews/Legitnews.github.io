var AI = {
	capitalTile : new Vector2(),

	lastPlaced : new Vector2(),

	chooseTile : function(grid, hasPlacedFirstNode, hardMode){
		if (!hasPlacedFirstNode){
			this.capitalTile[0] = grid.size.x - 8;
			this.capitalTile[1] = grid.size.y / 2 + Random.range(-5, 5);

			this.lastPlaced = this.capitalTile;

			return this.capitalTile;
		}
		else{
			return this.tileChooseHeuristic(grid, hardMode !== undefined ? hardMode : false);
		}
	},

	tileChooseHeuristic : function(grid, hardMode){

		var xWeight = 1.5;

		var chosen = null;
		var furthestDist;
		var dist;

		var distTile = hardMode ? this.lastPlaced : this.capitalTile;

		for (var i=grid.size.x-1; i >= 0; i--){
			for (var j=grid.size.y-1; j >= 0; j--){
				var tile = new Vector2(i, j);

				if (grid.getTileType(tile) == 4){
					dist = (distTile.x - tile.x) * xWeight + Math.abs(distTile.y - tile.y);

					if (chosen == null || dist > furthestDist){
						chosen = tile;
						furthestDist = dist;
					}
				}
			}
		}

		if (hardMode){
			var sTiles = grid.surroundingTiles(chosen);

			var blanks = [];

			for (var i=sTiles.length-1; i >= 0; i--){
				if (grid.getTileType(sTiles[i]) == -1){
					blanks.push(sTiles[i]);
				}
			}

			if (blanks.length > 0){
				chosen = Random.choice(blanks);
			}
		}

		this.lastPlaced.x = chosen[0];
		this.lastPlaced.y = chosen[1];

		return chosen;
	},
}
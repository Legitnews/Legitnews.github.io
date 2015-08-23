var MapGen = {
	randomEven : function(grid){
		for (var i = grid.size[0]; i--; ){
			for(var j = grid.size[1]; j--; ){
				grid.tileTypes[i][j] = Random.integer(0, 1);
			}
		}
	},
	
	lakes : function(grid){
		for (var i = grid.size[0]; i--; ){
			for(var j = grid.size[1]; j--; ){
				if (i > 0 && i < grid.size[0]-1 && j > 0 && j < grid.size[1]-1){
					
					var surroundings = [grid.tileTypes[i-1][j], grid.tileTypes[i+1][j], grid.tileTypes[i][j-1], grid.tileTypes[i][j+1]];
					
					chance = .05;
					
					for (tile in surroundings){
						if (surroundings[tile] == 1){
							if (chance === .05){
								chance += .34;
							}
							
							chance += chance / 2;
						}
					}
					
					if (Random.decimal(0, 1) < chance){
						grid.tileTypes[i][j] = 1;
					}
				}
			}
		}
	},
	
	walk : function(grid, ratio){
		ratio = ratio || 1;
		
		var adds = [-1, 1];
		
		var i = Random.range(grid.size[0]);
		var j = Random.range(grid.size[1]);
		
		
		
		for (var n = grid.size[0] * grid.size[1] / ratio; n--; ){
			grid.tileTypes[i][j] = 1;
			
			if (i <= 0){
				i++;
			}
			
			else if (i >= grid.size[0] - 1){
				i--;
			}
			
			if (j <= 0){
				j++;
			}
			
			else if (j >= grid.size[1] - 1){
				j--;
			}
			
			if (Random.chance(.5)){
				i += Random.choice(adds);
			}
			else{
				j += Random.choice(adds);
			}
		}
	},
};
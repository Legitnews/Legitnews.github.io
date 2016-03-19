/*
 *
 */

"use strict";

canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

function arrEq(a, b){
	if (a.length !== b.length){
		return false;
	}

	for (var i in a){
		if (a[i] !== b[i]){
			return false;
		}
	}

	return true;
}

function arrOrEq(a, eqs, wildcard){
	wildcard = wildcard !== undefined ? wildcard : "*";

	for (i in eqs){
		if (a.length !== eqs[i].length){
			return false;
		}
	}

	var placeEqual = false;

	for (var i in a){
		if (a[i] === wildcard){
			placeEqual = true;
			continue;
		}

		for (var j in eqs){
			if (eqs[j][i] === wildcard){
				placeEqual = true;
				continue;
			}

			if (a[i] === eqs[j][i]) {
				placeEqual = true;
				continue;
			}
		}

		if (! placeEqual){
			return false;
		}
		placeEqual = false;
	}

	return true;
}

var Game = {

	started : true,
	maxWidthPercent : 0.8,
	maxHeightPercent : 0.95,

  grid : null,

	gridWidth : 1,
	gridHeight : 1,

	turn : 0, //0: Line Dude 1: Wall Guy
	lines : 2, //Amount of lines Line Dude can place this turn
	linesPerTurn : 2,
	wall : 0, //0: Top 1: Right

	autoplay : false,

	tileset : new Tileset(tiles, [16, 16], [8, 8], 1),

	/*
		Tile Types:
		0 : Empty
		1 : Line
		2 : Wall Top
		3 : Wall Right
		4 : Wall Both
		5 : Line and Wall Top
		6 : Line and Wall Right
		7 : Line and Wall Both
	*/

	intro : function(){

	},

	init : function(){
		this.adjustAspectRatioFromInput();

		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
	},

	update : function(){

		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}

			return;
		}

		if (this.autoplay){
			this.playTurn([Random.range(this.grid.size[0]), Random.range(this.grid.size[1])]);
		}
	},

	render : function(){

		if (! this.started){
			this.intro();
			return;
		}

		if (this.grid){
			this.grid.draw(ctx, "#4444C0");
		  this.grid.fillTiles(ctx, true);
		}
	},

	toggleAutoplay : function(){
		this.autoplay = !this.autoplay;
		autoplayCheck.checked = this.autoplay;
	},

	checkMoveLineDude : function(tile){
		var type = this.grid.getTileType(tile);
		var context = this.getTileContext(tile);

		if ([1, 5, 6, 7].indexOf(type) !== -1){
			return false;
		}

		if (type === 2 && [1, 6].indexOf(context[3]) === -1 && [1, 5, 6, 7].indexOf(context[1]) === -1 && [1, 5].indexOf(context[2]) === -1){
			return false;
		}

		if (type === 3 && [1, 6].indexOf(context[3]) === -1 && [1, 5, 6, 7].indexOf(context[0]) === -1 && [1, 5].indexOf(context[2]) === -1){
			return false;
		}

		if (type === 4 && [1, 6].indexOf(context[3]) === -1 && [1, 5].indexOf(context[2]) === -1){
			return false;
		}

		if (tile[1] === this.gridHeight-1){
			return true;
		}

		var sTiles = this.grid.surroundingTiles(tile, true, false)

		for (var i in sTiles){
			var type = this.grid.tileTypes[sTiles[i][0]][sTiles[i][1]];

			if (type === 1){
				return true;
			}
		}

		if (this.grid.getTileType([tile[0], tile[1]-1]) === 5){
			return true;
		}

		else if (this.grid.getTileType([tile[0]+1, tile[1]]) === 5){
			return true;
		}

		else if (this.grid.getTileType([tile[0]-1, tile[1]]) === 5){
			return true;
		}

		if (this.grid.getTileType([tile[0]+1, tile[1]]) === 6){
			return true;
		}

		else if (this.grid.getTileType([tile[0], tile[1]+1]) === 6){
			return true;
		}

		else if (this.grid.getTileType([tile[0], tile[1]-1]) === 6){
			return true;
		}

		if (this.grid.getTileType([tile[0], tile[1]-1]) === 7){
			return true;
		}

		else if (this.grid.getTileType([tile[0]+1, tile[1]]) === 7){
			return true;
		}

		return false;
	},

	checkMoveWallGuy : function(tile){
		var type = this.grid.tileTypes[tile[0]][tile[1]];
		var context = this.getTileContext(tile);

		if (tile[1] === 0 || tile[1] === this.gridHeight-1){
			return false;
		}


		if (tile[0] === this.gridWidth-1 && this.wall === 1){
			return false;
		}

		if (type === 4 || type === 7){
			return false;
		}

		else if (this.wall === 0){
			if (type === 2 || type === 5){
				return false;
			}

			if ([1, 5, 6, 7].indexOf(type) !== -1 && [1, 5, 6, 7].indexOf(context[0]) !== -1){
				return false;
			}
		}

		else if (this.wall === 1){
			if (type === 3 || type === 6){
				return false;
			}

			if ([1, 5, 6, 7].indexOf(type) !== -1 && [1, 5, 6, 7].indexOf(context[1]) !== -1){
				return false;
			}
		}

		return true;
	},

  onClick : function(e){
		var tile = this.grid.pxToTileCoords(mousePos);

		if (e.button === 0){
			this.playTurn(tile);
		}

		else if (e.button === 2){
			console.log(this.grid.getTileType(tile));
		}
	},

	playTurn : function(tile){
		if (this.turn === 0){
			if (this.placeLineDude(tile)){
				this.lines--;

				if(this.lines <= 0){
					this.turn = 1;
					this.lines = this.linesPerTurn;
					turnPlayer.innerHTML = "Wall Guy";
				}
			}
		}

		else if (this.turn === 1){
			if (this.placeWallGuy(tile)){
				if (this.wall === 1){
					this.turn = 0;
					turnPlayer.innerHTML = "Line Dude";
					this.wall = 0;
				}

				else if (this.wall === 0){
					this.wall = 1;
				}
			}
		}

		this.setTileRenders();
	},

	placeLineDude : function(tile){
		if (! this.checkMoveLineDude(tile)){
			return false;
		}

		if (this.grid.getTileType(tile) === 2){
			this.grid.setTileType(tile, 5);
		}

		else if (this.grid.getTileType(tile) === 3){
			this.grid.setTileType(tile, 6);
		}

		else if (this.grid.getTileType(tile) === 4){
			this.grid.setTileType(tile, 7);
		}

		else{
			this.grid.setTileType(tile, 1);
		}

		return true;
	},

	placeWallGuy : function(tile){
		if (! this.checkMoveWallGuy(tile)){
			return false;
		}

		var type = this.grid.tileTypes[tile[0]][tile[1]];

		if (this.wall === 0){
			if (type === 0){
				this.grid.setTileType(tile, 2)
			}

			else if (type === 1){
				this.grid.setTileType(tile, 5)
			}

			else if (type === 3){
				this.grid.setTileType(tile, 4)
			}

			else if (type === 6){
				this.grid.setTileType(tile, 7)
			}
		}

		else if (this.wall === 1){
			if (type === 0){
				this.grid.setTileType(tile, 3)
			}

			else if (type === 1){
				this.grid.setTileType(tile, 6)
			}

			else if (type === 2){
				this.grid.setTileType(tile, 4)
			}

			else if (type === 5){
				this.grid.setTileType(tile, 7)
			}
		}

		return true;
	},

	setTileRenders : function(){
		for (var i = 0; i < this.grid.size[0]; i++){
			for (var j = 0; j < this.grid.size[1]; j++){
				this.setTileRender([i, j]);
			}
		}
	},

	getTileContext : function(tile){
		var context = [
			this.grid.getTileType([tile[0], tile[1]-1]),
			this.grid.getTileType([tile[0]+1, tile[1]]),
			this.grid.getTileType([tile[0]-1, tile[1]]),
			this.grid.getTileType([tile[0], tile[1]+1])
		];

		return context;
	},

	setTileRender : function(tile){
		var type = this.grid.getTileType(tile);
		var context = this.getTileContext(tile);

		var renderType = this.contextToTileRender(type, context);

		if (renderType === 403 && this.autoplay){
			this.toggleAutoplay();
		}

		this.grid.setTileRenderType(tile, renderType);
	},

	contextToTileRender : function(type, context){
		//The idea I had before this was uglier.

		//I'm so sorry

		//God there's probably some beautiful mathematical solution to this an i'm just sitting typing out numbers.

		if (type === 0){
			return -1;
		}

		else if (type === 2){
			return 215;
		}

		else if (type === 3){
			return 315;
		}

		else if (type === 4){
			return 415;
		}

		else if (type === 1){
			if (arrOrEq(context, [[0, 0, 0, 0], [-1, -1, -1, -1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4]])){
				return 115;
			}

			else if (arrOrEq(context, [[1, 1, 1, 1], [5, 5, 5, 1], [6, 6, 1, 6], [7, 7, 1, 1]])){
				return 110;
			}

			if (arrOrEq(context, [ [1, 0, 0, 1], [1, 2, 2, 1], [1, 3, 3, 1], [1, 4, 4, 1],
				 										 [6, 0, 0, 6], [5, 0, 6, 1], [7, 0, 7, 1], [1, -1, -1, 1]])){
				return 100;
			}

			if (arrOrEq(context, [ [0, 1, 1, 0], [2, 1, 1, 2], [3, 1, 1, 3], [4, 1, 1, 4],
				 										 [0, 5, 5, 0], [0, 6, 1, 5], [0, 7, 1, 7], [-1, 1, 1, -1] ])){
				return 101;
			}

			if (arrOrEq(context, [ [0, 0, 1, 1], [2, 2, 5, 1], [3, 3, 1, 1], [4, 4, 1, 6], [-1, -1, 1, 1] ])){
				return 102;
			}

			if (arrOrEq(context, [ [0, 1, 0, 1], [2, 5, 2, 1], [3, 6, 3, 1], [4, 7, 4, 6], [0, 1, 6, 1], [0, 1, 7, 1], [-1, 1, -1, 1]])){
				return 103;
			}

			if (arrOrEq(context, [ [1, 0, 1, 0], [1, 2, 5, 2], [1, 3, 1, 3], [6, 4, 1, 4], [7, 0, 1, 5], [5, 0, 1, 7], [1, -1, 1, -1]])){
				return 104;
			}

			if (arrOrEq(context, [ [1, 1, 0, 0], [6, 1, 2, 2], [7, 1, 3, 3], [1, 5, 4, 4], [1, 7, -1, -1], [5, 6, 7, 7], [1, 1, 6, 5]])){
				return 105;
			}

			if (arrOrEq(context, [ [1, 0, 1, 1], [5, 2, 5, 1], [7, 3, 1, 6], [6, 4, 1, 1], [1, -1, 1, 1]])){
				return 106;
			}

			if (arrOrEq(context, [ [1, 1, 0, 1], [5, 5, 2, 6], [7, 7, 3, 1], [6, 6, 4, 1], [1, 1, -1, 1], [1, 1, 6, 1], [1, 1, 7, 1]])){
				return 107;
			}

			if (arrOrEq(context, [ [1, 1, 1, 0], [5, 5, 5, 2], [6, 6, 1, 3], [7, 7, 1, 4], [1, 1, 1, -1], [1, 1, 1, 5], [1, 1, 1, 7]])){
				return 108;
			}

			if (arrOrEq(context, [ [0, 1, 1, 1], [2, 5, 5, 1], [3, 6, 1, 6], [4, 7, 1, 1], [-1, 1, 1, 1]])){
				return 109;
			}

			if (arrOrEq(context, [[0, 0, 0, 1], [2, 2, 2, 6], [3, 3, 3, 1], [4, 4, 4, 1], [-1, -1, -1, 1], [0, 0, 6, 1], [0, 0, 7, 1]])){
				return 111;
			}

			if (arrOrEq(context, [[0, 0, 1, 0], [2, 2, 5, 2], [3, 3, 1, 3], [4, 4, 1, 4], [-1, -1, 1, -1], [0, 0, 1, 5], [0, 0, 1, 7]])){
				return 112;
			}

			if (arrOrEq(context, [[0, 1, 0, 0], [2, 5, 2, 2], [3, 6, 3, 3], [4, 7, 4, 4], [-1, 1, -1, -1], [0, 1, 6, 5], [0, 1, 7, 7]])){
				return 113;
			}

			if (arrOrEq(context, [[1, 0, 0, 0], [5, 2, 2, 2], [6, 3, 3, 3], [7, 4, 4, 4], [1, -1, -1, -1], [1, 0, 6, 5], [1, 0, 7, 7]])){
				return 114;
			}

			return 403;
		}

		else if (type === 5){
			if (arrOrEq(context, [ [0, 1, 1, 0], [2, 1, 1, 2], [3, 1, 1, 3], [4, 1, 1, 4],
				 										 [0, 5, 5, 0], [0, 6, 1, 5], [0, 7, 1, 7], [-1, 1, 1, -1], ["*", 1, 1, 0]])){
				return 201;
			}

			if (arrOrEq(context, [ [0, 0, 5, 1], [2, 2, 1, 1], [3, 3, 1, 1], [4, 4, 1, 6], [-1, -1, 1, 1], ["*", 0, 1, 1]])){
				return 202;
			}

			if (arrOrEq(context, [ [0, 1, 0, 1], [2, 5, 2, 1], [3, 6, 3, 1], [4, 7, 4, 6], [0, 1, 6, 1], [0, 1, 7, 1], [-1, 1, -1, 1], ["*", 1, 0, 1]])){
				return 203;
			}

			if (arrOrEq(context, [ [0, 1, 1, 1], [2, 5, 5, 1], [3, 6, 1, 6], [4, 7, 1, 1], [-1, 1, 1, 1], ["*", 1, 1, 1]])){
				return 209;
			}

			if (arrOrEq(context, [[0, 0, 0, 1], [2, 2, 2, 6], [3, 3, 3, 1], [4, 4, 4, 1], [-1, -1, -1, 1], [0, 0, 6, 1], [0, 0, 7, 1], ["*", 0, 0, 1]])){
				return 211;
			}

			if (arrOrEq(context, [[0, 0, 1, 0], [2, 2, 5, 2], [3, 3, 1, 3], [4, 4, 1, 4], [-1, -1, 1, -1], [0, 0, 1, 5], [0, 0, 1, 7], ["*", 0, 1, 0]])){
				return 212;
			}

			if (arrOrEq(context, [[0, 1, 0, 0], [2, 5, 2, 2], [3, 6, 3, 3], [4, 7, 4, 4], [-1, 1, -1, -1], [0, 1, 6, 5], [0, 1, 7, 7], ["*", 1, 0, 0]])){
				return 213;
			}

			return 403;
		}

		else if (type === 6){
			if (arrOrEq(context, [ [1, 0, 0, 1], [1, 2, 2, 1], [1, 3, 3, 1], [1, 4, 4, 1],
														 [6, 0, 0, 6], [5, 0, 6, 1], [7, 0, 7, 1], [1, -1, -1, 1], [1, "*", 0, 1]])){
				return 300;
			}

			if (arrOrEq(context, [ [0, 0, 1, 1], [2, 2, 5, 1], [3, 3, 1, 1], [4, 4, 1, 6], [-1, -1, 1, 1], [0, "*", 1, 1] ])){
				return 302;
			}

			if (arrOrEq(context, [ [1, 0, 1, 0], [1, 2, 5, 2], [1, 3, 1, 3], [6, 4, 1, 4], [7, 0, 1, 5], [5, 0, 1, 7], [1, -1, 1, -1], [1, "*", 1, 0]])){
				return 304;
			}

			if (arrOrEq(context, [ [1, 0, 1, 1], [5, 2, 5, 1], [7, 3, 1, 1], [6, 4, 1, 6], [1, -1, 1, 1], [1, "*", 1, 1]])){
				return 306;
			}

			if (arrOrEq(context, [[0, 0, 0, 1], [2, 2, 2, 6], [3, 3, 3, 1], [4, 4, 4, 1], [-1, -1, -1, 1], [0, 0, 6, 1], [0, 0, 7, 1], [0, "*", 0, 1]])){
				return 311;
			}

			if (arrOrEq(context, [[0, 0, 1, 0], [2, 2, 5, 2], [3, 3, 1, 3], [4, 4, 1, 4], [-1, -1, 1, -1], [0, 0, 1, 5], [0, 0, 1, 7], [0, "*", 1, 0]])){
				return 312;
			}

			if (arrOrEq(context, [[1, 0, 0, 0], [5, 2, 2, 2], [6, 3, 3, 3], [7, 4, 4, 4], [1, -1, -1, -1], [1, 0, 6, 5], [1, 0, 7, 7], [1, "*", 0, 0]])){
				return 314;
			}

			return 403;
		}

		else if (type === 7){
			if (arrOrEq(context, [ [0, 0, 1, 1], [2, 2, 5, 1], [3, 3, 1, 1], [4, 4, 1, 6], [-1, -1, 1, 1], ["*", "*", 1, 1] ])){
				return 402;
			}

			if (arrOrEq(context, [[0, 0, 0, 1], [2, 2, 2, 6], [3, 3, 3, 1], [4, 4, 4, 1], [-1, -1, -1, 1], [0, 0, 6, 1], [0, 0, 7, 1], ["*", "*", 0, 1]])){
				return 411;
			}

			if (arrOrEq(context, [[0, 0, 1, 0], [2, 2, 5, 2], [3, 3, 1, 3], [4, 4, 1, 4], [-1, -1, 1, -1], [0, 0, 1, 5], [0, 0, 1, 7], ["*", "*", 1, 0]])){
				return 412;
			}

			return 403;
		}
	},

	adjustAspectRatioFromInput : function(){
		var width = widthInput.value;
		var height = heightInput.value;

		this.adjustAspectRatio(width, height);
	},

  adjustAspectRatio: function(width, height){
		this.gridWidth = width;
		this.gridHeight = height;

		this.resizeCanvas();
		this.remakeGrid();
  },

	resizeCanvas: function(){
		var maxWidth = window.innerWidth * this.maxWidthPercent;
    var maxHeight = window.innerHeight * this.maxHeightPercent;

		var ratio = this.gridWidth / this.gridHeight;
		var maxRatio = maxWidth / maxHeight;

    var newWidth;

    if (this.gridWidth > this.gridHeight * maxRatio){
      newWidth = maxWidth;
    }

    else{
      newWidth = maxHeight * ratio;
    }


		canvas.width = Math.floor(newWidth / this.gridWidth) * this.gridWidth;
		canvas.height = Math.floor((newWidth / ratio) / this.gridHeight) * this.gridHeight;
		settings.style.paddingLeft = ((window.innerWidth + newWidth)/2 + "px");

		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
	},

  remakeGrid: function(width, height){
		var intToTileRender = {
			100 : Game.tileset[0][0],
			101 : Game.tileset[0][1],
			102 : Game.tileset[0][2],
			103 : Game.tileset[0][3],
			104 : Game.tileset[0][4],
			105 : Game.tileset[0][5],
			106 : Game.tileset[0][6],
			107 : Game.tileset[0][7],
			108 : Game.tileset[0][8],
			109 : Game.tileset[0][9],
			110 : Game.tileset[0][10],
			111 : Game.tileset[0][11],
			112 : Game.tileset[0][12],
			113 : Game.tileset[0][13],
			114 : Game.tileset[0][14],
			115 : Game.tileset[0][15],

			200 : Game.tileset[1][0],
			201 : Game.tileset[1][1],
			202 : Game.tileset[1][2],
			203 : Game.tileset[1][3],
			204 : Game.tileset[1][4],
			205 : Game.tileset[1][5],
			206 : Game.tileset[1][6],
			207 : Game.tileset[1][7],
			208 : Game.tileset[1][8],
			209 : Game.tileset[1][9],
			210 : Game.tileset[1][10],
			211 : Game.tileset[1][11],
			212 : Game.tileset[1][12],
			213 : Game.tileset[1][13],
			214 : Game.tileset[1][14],
			215 : Game.tileset[1][15],

			300 : Game.tileset[2][0],
			301 : Game.tileset[2][1],
			302 : Game.tileset[2][2],
			303 : Game.tileset[2][3],
			304 : Game.tileset[2][4],
			305 : Game.tileset[2][5],
			306 : Game.tileset[2][6],
			307 : Game.tileset[2][7],
			308 : Game.tileset[2][8],
			309 : Game.tileset[2][9],
			310 : Game.tileset[2][10],
			311 : Game.tileset[2][11],
			312 : Game.tileset[2][12],
			313 : Game.tileset[2][13],
			314 : Game.tileset[2][14],
			315 : Game.tileset[2][15],

			400 : Game.tileset[3][0],
			401 : Game.tileset[3][1],
			402 : Game.tileset[3][2],
			403 : Game.tileset[3][3],
			404 : Game.tileset[3][4],
			405 : Game.tileset[3][5],
			406 : Game.tileset[3][6],
			407 : Game.tileset[3][7],
			408 : Game.tileset[3][8],
			409 : Game.tileset[3][9],
			410 : Game.tileset[3][10],
			411 : Game.tileset[3][11],
			412 : Game.tileset[3][12],
			413 : Game.tileset[3][13],
			414 : Game.tileset[3][14],
			415 : Game.tileset[3][15],
		};

		var tileDim = Math.floor(canvas.width / this.gridWidth);

		if (this.grid){
			var tileTypes = this.grid.tileTypes;
		}

		this.grid = new Grid([0, 0], [this.gridWidth, this.gridHeight], [tileDim, tileDim], canvas, 0, -1, intToTileRender);

		if (tileTypes){
			this.grid.tileTypes = tileTypes;
			this.setTileRenders();
		}
  },
}

window.onresize = function(){ Game.resizeCanvas(); Game.remakeGrid(); };
canvas.onmousedown = function(e){ Game.onClick(e); };
widthInput.onchange = function(){ Game.adjustAspectRatioFromInput(); };
heightInput.onchange = function(){ Game.adjustAspectRatioFromInput(); };
autoplayCheck.onchange = function(){ Game.toggleAutoplay(); };

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

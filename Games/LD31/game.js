/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : false,

	grid : null,

	title : null,

	paused : false,
	spaceLastFrame : false,
	altLastFrame : false,

	instructionDialogue : [
		"Instructions:\n\nThe goal of this game is to secure control over the board. This is done by placing 'nodes' by clicking the mouse on a tile on the board.",
		"Each node spreads influence to its adjacent tiles. These tiles thus have a chance each tick of coming under your control. They do not become nodes but 'influenced' tiles. Influnced tiles also spread a little influence.",
		"You can place a node on any of your influenced tiles or in an empty tile adjacent to one. You can place your first node in any of the tiles highlighted in green.",
		"You can place a node at any time, but every time you place a node so too will your opponent, who also wants to gain control. You are able to take enemy tiles by influencing them, but more influence is required than when taking empty tiles. Enemy tiles can also influence your tiles.",
		"When you control over 80% of the board you will win the game!",
	],

	gameState : 0, //-1:LOSE 0:ONGOING 1:WIN.

	hasUsedEasyMode : false,

	music : [],
	isMuted : false,
	currentSong : null,

	hasPlacedFirstNode : {
		1 : false,
		2 : false,
	},

	redControl : null,
	blueControl : null,

	pauseCheckbox : null,
	muteCheckbox : null,

	speedRadioButtons : null,
	difficultyRadioButtons : null,

	instructionsButton : null,
	controlsButton : null,

	speedToDelay : {
		1 : 500,
		2 : 250,
		3 : 100,
		4 : 20,
	},

	mapUpdateIntervalID : 0,
	currentSpeed : 2,
	difficulty : 2,
	
	intro : function(){
		ctx.drawImage(this.title, 0, 0);
	},
	
	init : function(){
		this.title = document.getElementById("title");

		this.intro();

		var intToTileRender = {
			1 : "#FF0000",
			2 : "#0000FF",
			3 : "#FF8888",
			4 : "#8888FF",
			5 : "#88FF88",
		};

		this.grid = new Grid(new Vector2(0, 0), new Vector2(40, 30), new Vector2(20, 20), canvas, -1, intToTileRender);

		this.redControl = document.getElementById("redControl");
		this.blueControl = document.getElementById("blueControl");

		this.pauseCheckbox = document.getElementById("pause");
		this.muteCheckbox = document.getElementById("mute");

		this.pauseCheckbox.checked = false;

		this.music = document.getElementsByName("music");

		if (this.muteCheckbox.checked){
			this.mute();
		}

		this.muteCheckbox.onclick = function(){ Game.mute(); };

		this.speedRadioButtons = document.getElementsByName("speed");
		this.difficultyRadioButtons = document.getElementsByName("difficulty");

		this.instructionsButton = document.getElementById("instructions");
		this.controlsButton = document.getElementById("controls");

		this.instructionsButton.onclick = function(){ Game.instructions(); };
		this.controlsButton.onclick = function(){ Game.controls(); };	

		var tile = new Vector2();

		for (tile.x=8; tile.x >= 0; tile.x--){
			for(tile.y=this.grid.size.y-1; tile.y >= 0; tile.y--){
				this.grid.setTileType(tile, 5);
			}
		}
	},

	begin : function(){
		this.currentSong = this.music[0];
		this.currentSong.play();

		this.mapUpdateIntervalID = window.setInterval(function(){ Game.updateMap(); }, this.speedToDelay[this.currentSpeed]);
		window.setInterval(function(){ Game.updateControlScores(); }, 50);
		window.setInterval(function(){ Game.checkWonLost(); }, 100);
		window.setInterval(function(){ Game.checkSpeed(); }, 100);
		window.setInterval(function(){ Game.checkDifficulty(); }, 100);
		window.setInterval(function(){ Game.updateSong(); }, 100);

		canvas.onmousedown = function(e){ Game.onClick(e)};

		if (!readCookie("hasPlayedBefore")){
			createCookie("hasPlayedBefore", true);

			window.setTimeout(function(){ Game.firstTime(); Game.instructions(); }, 100);
		}
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
				this.begin();
			}
			
			return;
		}

		//Pausing.

		this.paused = this.pauseCheckbox.checked;

		if (Key.isDown(Key.SPACE)){
			if (! this.spaceLastFrame){
				this.spaceLastFrame = true;

				this.paused = !this.paused;
			}
		}
		else{
			this.spaceLastFrame = false;
		}

		if (Key.isDown(Key.M)){
			if (! this.altLastFrame){
				this.altLastFrame = true;

				this.mute();
			}
		}
		else{
			this.altLastFrame = false;
		}

		if (this.gameState == -1){
			this.paused = true;
		}

		this.pauseCheckbox.checked = this.paused;
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}

		this.grid.fillTiles(ctx);
		this.grid.draw(ctx, "#000000", 2);
	},

	firstTime : function(){
		alert("Welcome! It looks like it's your first time playing. (or you deleted your cookies).");
	},

	instructions : function(){
		for (var i=0; i < this.instructionDialogue.length; i++){ //Stupid forward for loops.
			alert(this.instructionDialogue[i]);
		}
	},

	controls : function(){
		alert("Controls:\n\nClick to place nodes\nSpacebar: Pause/Unpause\n M: Mute/Unmute");
	},

	checkSpeed : function(){
		var button;

		for (var i=this.speedRadioButtons.length-1; i >= 0; i--){ //That's more like it.
			button = this.speedRadioButtons[i];

			if (button.checked){
				if (button.value != this.currentSpeed){
					this.currentSpeed = button.value;
					window.clearInterval(this.mapUpdateIntervalID);
					this.mapUpdateIntervalID = window.setInterval(function(){ Game.updateMap(); }, this.speedToDelay[this.currentSpeed]);
				}

				break;
			}
		}
	},

	checkDifficulty : function(){
		var button;

		for (var i=this.difficultyRadioButtons.length-1; i >= 0; i--){
			button = this.difficultyRadioButtons[i];

			if (button.checked){
				if (button.value != this.difficulty){
					this.difficulty = button.value;

					if (this.difficulty == 1){
						this.hasUsedEasyMode = true;
					}
				}

				break;
			}
		}
	},

	updateSong : function(){
		var nextSong = this.currentSong;
		var control = this.getControlPercentages();

		var fadeoutTime = 2;

		if (control[0] > .65){
			nextSong = this.music[1];
		}
		else if (control[1] > .45){
			nextSong = this.music[2];
		}
		else if (control[0] <= .6 || control[1] <= .4) {
			nextSong = this.music[0];
		}

		if (nextSong !== this.currentSong){
			if (this.currentSong.volume <= 0){
				this.currentSong.pause();
				this.currentSong.currentTime = 0;
				this.currentSong.volume = 1;
				this.currentSong = nextSong;
				this.currentSong.play();
			}
			else{
				var vol = this.currentSong.volume;

				vol -= (.1 / fadeoutTime);

				this.currentSong.volume = vol > 0 ? vol : 0;
			}
		}
		else{
			this.currentSong.volume = 1;
		}
	},

	onClick : function(e){
		if (this.paused){
			return;
		}

		var tile = this.grid.pxToTileCoords(mousePos);

		var team = e.button == 0 ? 1 : 2;

		if (this.placeNode(tile, 1)){
			this.placeNode(AI.chooseTile(this.grid, this.hasPlacedFirstNode[2], this.difficulty >= 3), 2);
		}
	},

	mute : function(){
		this.isMuted = !this.isMuted;

		for (var i=this.music.length-1; i >= 0; i--){
			this.music[i].muted = this.isMuted;
		}

		this.muteCheckbox.checked = this.isMuted;
	},

	calcPressures : function(tile){
		var type = this.grid.getTileType(tile);

		var sTiles = this.grid.surroundingTiles(tile);

		var redPressure = 0;
		var bluePressure = 0;

		if (type == 1){
			redPressure -= 1000;
			bluePressure -= .04;
		}

		else if (type == 2){
			redPressure -= .04;
			bluePressure -= 1000;
		}

		else if (type == 3){
			bluePressure -= .008;
		}

		else if (type == 4){
			redPressure -= .008;
		}

		if (this.difficulty == 1){
			bluePressure -= .004;
		}
		else if (this.difficulty == 4){
			redPressure -= .004;
		}

		for (var i=sTiles.length-1; i >= 0; i--){
			var sType = this.grid.getTileType(sTiles[i]);

			if (sType == 1){
				redPressure += .05;
			}
			else if (sType == 3){
				redPressure += .004;
			}

			if (sType == 2){
				bluePressure += .05;
			}
			else if (sType == 4){
				bluePressure += .004;
			}
		}

		return [redPressure, bluePressure];
	},

	placeNode : function(tile, team){
		if (! this.hasPlacedFirstNode[team]){
			if ((tile.x <= 8 && team == 1) || (tile.x >= this.grid.size.x - 8 && team == 2)){

				if (team === 1){
					this.grid.fillDefault();
				}

				this.grid.setTileType(tile, team);
				this.hasPlacedFirstNode[team]= true;

				return true;
			}

			return false;
		}

		else{
			var type = this.grid.getTileType(tile);

			if (type == team+2){
				this.grid.setTileType(tile, team);
				return true;
			}
			else if (type != -1){
				return false;
			}

			var sTiles = this.grid.surroundingTiles(tile);

			for (var i = sTiles.length-1; i >= 0; i--){
				if (this.grid.getTileType(sTiles[i]) == team+2){
					this.grid.setTileType(tile, team);
					return true;
				}
			}

			return false;
		}

		return false;
	},

	updateMap : function(){
		if (this.paused){
			return;
		}

		for (var i=this.grid.size.x-1; i >= 0; i--){
			for(var j=this.grid.size.y-1; j >= 0; j--){
				var tile = new Vector2(i, j);

				var pressures = this.calcPressures(tile);

				var makeRed = Random.chance(pressures[0]);
				var makeBlue = Random.chance(pressures[1]);

				if (makeRed && !makeBlue){
					this.grid.setTileType(tile, 3);
				}

				else if (makeBlue && !makeRed){
					this.grid.setTileType(tile, 4);
				}
			}		
		}
	},

	updateControlScores : function(){
		var control = this.getControlPercentages();

		this.redControl.innerHTML  = Math.round(control[0] * 100) + "%";
		this.blueControl.innerHTML = Math.round(control[1] * 100) + "%";
	},

	getControlPercentages : function(){
		var totalTiles = this.grid.size.x * this.grid.size.y;

		var reds = 0;
		var blues = 0;
		var unclaimed = 0;

		for (var i = this.grid.size.x-1; i >= 0; i--){
			for(var j = this.grid.size.y-1; j >= 0; j--){
				var tile = new Vector2(i, j);
				var type = this.grid.getTileType(tile);

				if (type == 1 || type == 3){
					reds++;
				}

				else if (type == 2 || type == 4){
					blues++;
				}

				else{
					unclaimed++;
				}
			}
		}

		return [reds / totalTiles, blues / totalTiles, unclaimed / totalTiles];
	},

	checkWonLost : function(){
		if (this.gameState == 2){
			return;
		}

		var control = this.getControlPercentages();

		if (this.gameState == 1 && control[0] > .9 && ! this.hasUsedEasyMode){
			this.onSnowman();
			return;
		}

		if (this.gameState != 0){
			return;
		}

		if (control[0] > .8){
			this.onWin();
			return;
		}

		else if (control[1] > .6){
			this.onLoss();
			return;
		}
	},

	onWin : function(){
		this.paused = true;
		this.pauseCheckbox.checked = this.paused;
		this.gameState = 1;

		alert("You control over 80% of the board.\nYou Win!\n\nYou may continue playing by unpausing the game if you wish.");
	},

	onSnowman : function(){
		this.paused = true;
		this.pauseCheckbox.checked = this.paused;
		this.gameState = 2;

		alert("\u2603\u2603\u2603 SNOWMAN END \u2603\u2603\u2603");
	},

	onLoss : function(){
		this.paused = true;
		this.pauseCheckbox.checked = this.paused;
		this.gameState = -1;

		alert("Your opponent controls over 60% of the board.\nYou Lose!");
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

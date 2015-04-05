var grid;
var running = false;

var newTileTypes = [];

var generations = 0;

var tickDelay = .25;
var timeUntilTick = 0;

var mousedown = false;
var prevTile = [];

var B = [3];
var S = [2, 3];

document.getElementById("next").onclick = tick;
document.getElementById("start").onclick = function() { running = !running; this.textContent = running ? "Stop" : "Start"};
document.getElementById("clear").onclick = function() { grid.clear(); generations = 0; generationsLabel.textContent = 0;};

document.getElementById("speed").onclick = updateSpeed;
document.getElementById("size").onclick = updateSize;

var headless = document.getElementById("headless");

var generationsLabel = document.getElementById("generations");

function init(){
	grid = new Grid([0, 0], [160, 90], [10, 10], {0 : "#FFFFFF", 1 : "000000"});
	
	grid.size = [80, 60];
	
	var n = grid.tileTypes.length;
	
	while(n--){
		newTileTypes.unshift(grid.tileTypes[n].slice(0));
	}
}

function switchMouseTile(){
		
	var tile = grid.pointToTile(mousePos);
	
	if (tile === null){
		return;
	}
	
	if (tile[0] === prevTile[0] && tile[1] === prevTile[1]){
		return;
	}
	
	prevTile = tile;
		
	grid.tileTypes[tile[0]][tile[1]] = grid.tileTypes[tile[0]][tile[1]] === 0 ? 1 : 0;
}

function onMouseDown(){
	mousedown = true;
}
function onMouseUp(){
	mousedown = false;
	prevTile = [];
}

window.onmousedown = onMouseDown;
window.onmouseup = onMouseUp;

function updateSpeed(){
	var speed = document.querySelector('input[name="speed"]:checked').value;
	
	if (speed === "slow"){
		tickDelay = .25;
	}
	else if (speed === "medium"){
		tickDelay = .1;
	}
	else if (speed === "fast"){
		tickDelay = .05;
	}
	else if (speed === "max"){
		tickDelay = .0001;
	}
}

function updateSize(){
	var size = document.querySelector('input[name="size"]:checked').value;
	
	if (size === "small"){
		canvas.width = 800;
		canvas.height = 600;
		
		grid.size = [40, 30];
		grid.tileSize = [20, 20];
	}
	
	else if (size === "medium"){
		canvas.width = 800;
		canvas.height = 600;
		
		grid.size = [80, 60];
		grid.tileSize = [10, 10];
	}
	
	else if (size === "large"){
		canvas.width = 1600;
		canvas.height = 900;
		
		grid.size = [160, 90];
		grid.tileSize = [10, 10];
	}
}

function update(){
	updateDeltaTime();
	
	if (mousedown){
		switchMouseTile();
	}
	
	if (! running){
		return;
	}
	
	timeUntilTick -= deltaTime;
	
	if (timeUntilTick <= 0){
		tick();
		timeUntilTick = tickDelay;
	}
		
}

function tick(){
	generations++;
	generationsLabel.textContent = generations;
	
	var i = grid.size[0];
	var j;
	
	var stiles;
	var neighbours;
	
	while(i--){
		j = grid.size[1];
		
		while(j--){
			stiles = grid.surroundingTileTypes([i, j]);
			neighbours = stiles.filter(function(x) { return x === 1; }).length;
			
			newTileTypes[i][j] = grid.tileTypes[i][j];
			
			if (S.indexOf(neighbours) === -1){
				newTileTypes[i][j] = 0;
			}
			
			if (B.indexOf(neighbours) !== -1){
				newTileTypes[i][j] = 1;
			}
		}
	}
	
	var n = grid.size[0];
	
	while(n--){
		grid.tileTypes[n] = newTileTypes[n].slice(0);
	}
}

function render(){
	
	if (headless.checked){
		return;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	grid.fillTiles(ctx, true);
	grid.draw(ctx, "#777777");
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame    ||
          	function( callback ){
          		window.setTimeout(callback, 1000 / FPS);
          	};
})();


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

setTimeout(main, 1000);

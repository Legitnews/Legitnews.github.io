var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);

function randomColour(){
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	
	return [r, g, b];
}

function init(){
}

function update(){
}

function render(){
	updateDeltaTime();
	
	return;
	
	ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
	
	var colour;
	var index;
	
	for (var i = canvas.width; i >= 0; i--){
		for(var j = canvas.height; j >= 0; j--){
			
			index = (i + j * canvas.width) * 4;
			colour = randomColour();
			
			canvasData.data[index + 0] = colour[0];
			canvasData.data[index + 1] = colour[1];
			canvasData.data[index + 2] = colour[2];
			canvasData.data[index + 3] = 255;
		}
	}
	
	ctx.putImageData(canvasData, 0, 0);

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

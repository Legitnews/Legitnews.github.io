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
		
		var d = new Date();
		
		ctx.fillStyle = this.timeColour(d);
		ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
		
		ctx.fillStyle = this.dateColour(d);
		ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
	},
	
	timeColour: function(d){
		var r = Math.floor(d.getSeconds() * (256 / 60));
		var g = Math.floor(d.getMinutes() * (256 / 60));
		var b = Math.floor(d.getHours() * (256 / 24));
		
		return "rgb(" + r + "," + g + "," + b + ")";
	},
	
	dateColour : function(d){
		var year = d.getFullYear();
		
		var r = Math.floor(d.getDate() * (256 / 31));
		var g = Math.floor(d.getMonth() * (256 / 12));
		var b = Math.floor((year - Math.floor(year/100)*100) * (256 / 100));
		
		return "rgb(" + r + "," + g + "," + b + ")";
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

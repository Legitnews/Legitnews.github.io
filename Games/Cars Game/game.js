function canvasFill(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	SCREENRECT = new Rect([0, 0], [canvas.width, canvas.height]);
}

window.onresize = canvasFill;

var Game = {
	cars : [],
	numCars : 4,
	
	KEYMODES : ["WASD", "Arrows", "IJKL", "Numpad"],
	COLOURS : ["Red", "Blue", "Green", "Yellow"],
	CAR_SIZE : new Vector2(25, 50),
	
	colliders : [],
		
	init : function(){
		canvasFill();
		
		for (var i=0; i < this.numCars; i++){
			var pos = new Vector2(canvas.width * ((i === 0 || i === 2) ? .25 : .75), canvas.height * ((i === 0 || i === 1) ? .25 : .75));
			
			this.cars.push(new Car(this.KEYMODES[i], pos, this.COLOURS[i], this.CAR_SIZE))
		}
		
		for (i in this.cars){
			this.colliders.push(this.cars[i].collider);
		}
	},
	
	update : function(){
		for (i in this.cars){
			this.cars[i].update(this.colliders);
		}
	},
	
	render : function(){
		for (i in this.cars){
			this.cars[i].draw(ctx);
		}
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

setTimeout(main, 1000);

/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {

	canvas : document.getElementById("canvas"),
	ctx : canvas.getContext("2d"),
	
	started : true,
	
	intro : function(){
		//this.ctx.drawImage(title, 0, 0);
	},
	
	init : function(){
		this.intro();

		AnimationThread.start();

		var mousewheelevt = ((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel");
		window.addEventListener(mousewheelevt, function(event) { Game.onMouseWheel(e); }, false);

		this.ctx.font = "12px Verdana";

		this.ctx.save();
		this.onResize();

		window.onresize = function(e){ Game.onResize(e); };
		
		
	},

	firstFrame : function(){
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
				this.firstFrame();
			}
			
			return;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}

		//ctx.fillText(Math.floor(1 / deltaTime), 0, 12); //FPS Display
	},

	onMouseWheel : function(e){

	},

	onResize : function(e){
		this.setOriginAtCentre();
		this.fitToInnerSize();
		this.alignGrids();
	},

	setOriginAtCentre : function(){
		this.ctx.restore();
		this.ctx.save();
		
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
	},

	fitToInnerSize : function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},

	alignGrids : function(){

	}
}

function init(){
	Game.init();
}

function update(){
	Time.update();
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
	
	window.setInterval(update, 1);
	
	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

main();

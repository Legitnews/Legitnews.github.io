/*
 *
 */

"use strict";

var Game = {

	started : true,
    hasInitted : false,

	intro : function(){

	},

	init : function(){
		this.intro();
        
        users_init();
        computer_init();
        
        Terminal.init();
	},

	update : function(){

		if (! this.started || !allAssetsLoaded()){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}

			return;
		}
        
        if (! this.hasInitted){
            this.init();
            this.hasInitted = true;
        }
        
        Terminal.update();
	},

	render : function(){

		if (! this.started || !allAssetsLoaded()){
			this.intro();
			return;
		}

        Terminal.render();
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
	Game.render();
}

function main(){
	window.setInterval(update, 5);

	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

setTimeout(main, 5);

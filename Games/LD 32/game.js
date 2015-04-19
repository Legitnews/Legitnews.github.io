/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : true,
	bar : null,
	currTextbox : null,

	blair : document.getElementById("blair"), //Sexy black Tony Blair
	blairPos : new Vector2(0, 80),
	clare : document.getElementById("clare"), //Clare Short
	clarePos : new Vector2(350, 80),

	drawBlair : false,
	drawClare : false,

	movedTextbox : true,

	tutorialTextbox : false,
	lost : false,

	fadeout : false,
	fadeTime : 20,
	fadeTimeElapsed : 0,

	doorAnimTime : 0.1,
	doorAnimTimeLeft : 0,

	clap : document.getElementById("clap"),
	yes : document.getElementById("yes"),
	noise : document.getElementById("noise"),
	fail : document.getElementById("fail"),
	mightyquinn : document.getElementById("mightyquinn"),

	dialogue : [
		[
			null,
		 	"May 2003, Westminster.",
		],
		[
			"Tony Blair",
		 	"As you can all see, Iraq has access to Weapons of Mass Destruction. We must invade."
		],
		[
			"Clare Short",
		 	"But you haven't even consulted the Cabinet on this matter. Declaring war now would border on tyrannical."
		],
		[
			"Blair",
		 	"These are exceptional circumstances. The threat is too great, we can afford no delay."
		],
		[
			"Clare",
		 	"I am not convinced. If you declare this war I will resign from the Cabinet."
		],
		[
			"Blair",
		 	"I guess it's" + ' time I whipped out my "Weapon"'
		],
	],

	dialogueSounds : [
		null,
		document.getElementById("dialogue1"),
		document.getElementById("dialogue2"),
		document.getElementById("dialogue3"),
		document.getElementById("dialogue4"),
		document.getElementById("dialogue5"),
	],

	dialogueIndex : 0,
	
	intro : function(){
		
	},
	
	init : function(){
		this.intro();

		canvas.style.background = "url(img/cupboard.png)";

		this.nextTextbox();  
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}

		if (this.bar){
			this.bar.update(deltaTime);
			this.bar.handleInput(Key);
		}

		if (this.currTextbox){
			this.currTextbox.update(deltaTime);
		}

		if (((Key.isDown(Key.ENTER) && !this.tutorialTextbox) || (Key.isDown(Key.SPACE) && this.tutorialTextbox)) && ((!this.bar) || this.tutorialTextbox || this.lost) && this.currTextbox.done){
			if (this.lost){
				this.startBar();
				this.lost = false;
			}
			else if (this.tutorialTextbox){
				this.currTextbox = null;
				this.tutorialTextbox = false;
			}
			else{
				this.nextTextbox();
			}
		}

		if (this.doorAnimTimeLeft <= 0){
			canvas.style.background = "url(img/cupboard.png)";
		}

		this.doorAnimTimeLeft -= deltaTime;

		if (this.fadeout){
			this.fadeTimeElapsed += deltaTime;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}

		if (this.drawBlair){
			ctx.drawImage(this.blair, this.blairPos.x, this.blairPos.y);
		}

		if (this.drawClare){
			ctx.drawImage(this.clare, this.clarePos.x, this.clarePos.y);
		}

		if (this.bar){
			this.bar.draw(ctx);
		}
		if (this.currTextbox){
			this.currTextbox.draw(ctx);
		}

		if (this.fadeout){
			ctx.fillStyle = "rgba(0, 0, 0, " + (this.fadeTimeElapsed / this.fadeTime) + ")"
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	},

	startBar : function(){
		canvas.style.background = "url(img/cupboard.png)";

		this.bar = new Bar();

		this.drawBlair = false;
		this.drawClare = false;

		this.currTextbox = null;

		var tutorial = 'Mash Space to "Utilize your weapon"'

		this.currTextbox = new TextBox(tutorial, null, true);
		this.tutorialTextbox = true;
	},

	onLose : function(){
		this.lost = true;

		var message = 'Press Enter to Retry.'

		this.currTextbox = new TextBox(message, null, true);

		fail.play();

		//this.startBar();
	},

	onWin : function(){
		this.fadeout = true;
		window.setTimeout(function(){ this.yes.play();  }, 500);
		window.setTimeout(function(){ this.noise.play(); }, 800);
		window.setTimeout(function(){ this.mightyquinn.play(); }, 5000);
	},

	onPress : function(){
		canvas.style.background = "url(img/cupboard2.png)";
		this.doorAnimTimeLeft = this.doorAnimTime;

		this.clap.pause();
		this.clap.currentTime = 0;
		this.clap.play();
	},

	nextTextbox : function(){
		if (this.dialogueIndex >= this.dialogue.length){
			this.startBar();
			return;
		}

		if (this.dialogue[this.dialogueIndex][0] == "Tony Blair"){
			this.drawBlair = true;
		}

		if (this.dialogue[this.dialogueIndex][0] == "Clare Short"){
			this.drawClare = true;
		}

		this.currTextbox = new TextBox(this.dialogue[this.dialogueIndex][1], this.dialogue[this.dialogueIndex][0]);
		if (this.dialogueSounds[this.dialogueIndex])
			this.dialogueSounds[this.dialogueIndex].play();
		this.dialogueIndex++;
	}
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

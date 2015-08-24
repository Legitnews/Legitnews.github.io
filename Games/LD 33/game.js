/*
 *
 */

"use strict";

canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {

	started : true,
	bar : null,
	currTextbox : null,

	blair : document.getElementById("blair"), //Sexy Tony Blair
	blairPos : new Vector2(0, 80),
	clare : document.getElementById("clare"), //Clare Short
  rick : document.getElementById("rick"), //Rick McSlick
  rickgun : document.getElementById("rickgun"), //Rick McSlick with his gun
  blairdodge : document.getElementById("blairdodge"),
  rickfire : document.getElementById("rickfire"),
	rightPos : new Vector2(350, 80),
  gunOffset : new Vector2(-160, 0),

	drawLeft : null,
	drawRight : null,

	movedTextbox : true,

	tutorialTextbox : false,
	lost : false,

	fadeout : false,
	fadeTime : 10,
	fadeTimeElapsed : 0,

  QTEDone : false,
  QTEInterval : null,
  QTEText : null,
  QTETextPos : new Vector2(240, 100),
  QTEKeys : ["UP", "DOWN", "LEFT", "RIGHT"],
  QTETimeouts : [],

  KeySymbol : {
    "UP"    : "\u25B2",
    "DOWN"  : "\u25BC",
    "LEFT"  : "\u25C0",
    "RIGHT" : "\u25B6",
  },

  minigameDone : false,

	dialogue : [
		[
			null,
		 	"20th April, 2004, Westminster.",
		],
		[
			"Tony Blair",
		 	"The Iraqi threat is a great one. We have faced no danger like this before."
		],
		[
			"Clare Short",
		 	"I told you before we should never have entered this war. We didn't have proper justification."
		],
		[
			"Blair",
		 	"And I told you that the Iraq government has access to weapons of mass destruction."
		],
		[
			"Clare",
		 	"Furthermore, our troops have committed atrocities in Iraq. We are reviled--"
		],
		[
			"Blair",
		 	"Enough."
		],
    [
			"Blair",
		 	"I'm authorising the use of nuclear weapons. We must bring an end to this conflict."
		],
    [
      "Rick McSlick",
      "Hold it right there, Blair."
    ],
    [
      "Blair",
      "Who the hell are you?"
    ],
    [
      "Rick",
      "They call me Rick McSlick. I heard everything, Blair."
    ],
    [
      "Rick",
      "And I've been sent to put a stop to your plan.", true
    ],
	],

  dialoguePost : [
    [
      "Rick",
      "I'm out of bullets."
    ],
    [
      "Rick",
      "I'm outta here."
    ],
    [
      "Clare Short",
      "That was odd."
    ]
  ],


	dialogueSounds : [
		null,
		document.getElementById("dialogue1"),
		document.getElementById("dialogue2"),
		document.getElementById("dialogue3"),
		document.getElementById("dialogue4"),
		document.getElementById("dialogue5"),
    document.getElementById("dialogue6"),
    document.getElementById("dialogue7"),
    document.getElementById("dialogue8"),
    document.getElementById("dialogue9"),
    document.getElementById("dialogue10"),
	],

  dialogueSoundsPost : [
    document.getElementById("dialogue11"),
    document.getElementById("dialogue12"),
    document.getElementById("dialogue13"),
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

		if (this.fadeout){
			this.fadeTimeElapsed += deltaTime;
		}
	},

	render : function(){

		if (! this.started){
			this.intro();
			return;
		}

		if (this.drawLeft){
			ctx.drawImage(this.drawLeft, this.blairPos.x, this.blairPos.y);
		}

		if (this.drawRight){
      if (this.drawRight === this.rickgun || this.drawRight === this.rickfire){
        var drawpos = this.rightPos.copy().add(this.gunOffset);
      }
      else{
        var drawpos = this.rightPos;
      }

			ctx.drawImage(this.drawRight, drawpos.x, drawpos.y);
		}

		if (this.bar){
			this.bar.draw(ctx);
		}
		if (this.currTextbox){
			this.currTextbox.draw(ctx);
		}
    if (this.QTEText){
      ctx.font = "32px Arial"
      ctx.fillText(this.QTEText, this.QTETextPos.x, this.QTETextPos.y);
      ctx.font = "12px Snoot"
    }

		if (this.fadeout){
			ctx.fillStyle = "rgba(0, 0, 0, " + (this.fadeTimeElapsed / this.fadeTime) + ")"
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	},



  blairDodge : function(){
    this.drawLeft = this.blairdodge;

    window.setTimeout(function(){ Game.drawLeft = Game.blair; }, 200);
  },

  rickGun : function(time){
    this.drawRight = this.rickgun;

    window.setTimeout(function(){ Game.drawRight = Game.rick; }, time);
  },

  rickFire : function(){
    this.drawRight = this.rickfire;
    shot.play();

    window.setTimeout(function(){ Game.drawRight = Game.rick; }, 200);
  },

	onLose : function(){
		this.lost = true;

		var message = 'Press Enter to Retry.'

		this.currTextbox = new TextBox(message, null, true);

		//fail.play();

    this.QTEInterval = window.setInterval(function() {if(Key.isDown(Key.ENTER)){ window.clearInterval(Game.QTEInterval); Game.startMinigame(); }}, 5);
	},

	onWin : function(){
    this.currTextbox = null;
		this.fadeout = true;
		window.setTimeout(function(){ nukeit.play();  }, 10000);
		//window.setTimeout(function(){ this.noise.play(); }, 800);
		//window.setTimeout(function(){ this.mightyquinn.play(); }, 5000);
	},

  QTEKey : function(key, timeout){
    this.QTEDone = false;
    window.setTimeout(function() { window.clearInterval(Game.QTEInterval); Game.QTEText = null; if (!Game.QTEDone) Game.QTEFail(); } , timeout);
    this.QTEText = "Press " + this.KeySymbol[key] + "!";
    this.QTEInterval = window.setInterval(function() {if (Key.isDown(Key[key])) {Game.QTEPress();} else{ for(var i=0; i < Game.QTEKeys.length; i++) {console.log(i); if (Key.isDown(Game.QTEKeys[i])) Game.QTEFail(); } }  }, 1);
    this.rickGun(timeout);
  },

  QTEPress : function(){
    if (this.QTEDone) return;
    this.blairDodge();
    this.rickFire();
    this.QTEText = null;
    this.QTEDone = true;
    this.currTextbox = null;
    this.tutorialTextbox = false;
  },

  QTEFail : function(){
    window.clearInterval(Game.QTEInterval)
    this.rickFire();
    this.QTEInterval = window.setInterval(function(){ Game.blairPos.y += 2; if(Game.blairPos.y > canvas.height){ window.clearInterval(Game.QTEInterval); Game.onLose(); }}, 5);
    this.lost = true;

    for (var timeout in this.QTETimeouts){
      window.clearTimeout(this.QTETimeouts[timeout]);
    }
  },

  startMinigame : function(){
    this.lost = false;

    this.blairPos = new Vector2(0, 80);

    var tutorial = 'Press the arrow keys as they appear on screen.'

    this.currTextbox = new TextBox(tutorial, null, true);
    this.tutorialTextbox = true;

    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) Game.QTEKey(Random.choice(Game.QTEKeys), 1000); }, 2000));
    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) Game.QTEKey(Random.choice(Game.QTEKeys),  600); }, 4000));
    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) Game.QTEKey(Random.choice(Game.QTEKeys),  500); }, 5500));
    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) Game.QTEKey(Random.choice(Game.QTEKeys),  400); }, 6800));
    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) Game.QTEKey(Random.choice(Game.QTEKeys),  350); }, 7500));
    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) Game.QTEKey(Random.choice(Game.QTEKeys),  300); }, 8200));

    this.QTETimeouts.push(window.setTimeout(function(){ if(!Game.lost) { Game.minigameDone = true; Game.nextTextbox(); }}, 8600));
  },

	nextTextbox : function(){
    if (this.minigameDone && this.dialogue !== this.dialoguePost){
       this.dialogue = this.dialoguePost;
       this.dialogueSounds = this.dialogueSoundsPost;
       this.dialogueIndex = 0;

       window.setInterval(function(){ if (tune.volume > .1){ tune.volume -= .002; } else{ tune.pause(); }}, 5);
    }

		if (this.dialogueIndex >= this.dialogue.length){
      if (this.dialogue === this.dialoguePost){
        this.onWin();
        return;
      }

			this.startMinigame();
			return;
		}

    if (this.dialogue[this.dialogueIndex][2]){
      this.drawRight = this.rickgun;
    }

		else if (this.dialogue[this.dialogueIndex][0] == "Tony Blair"){
			this.drawLeft = this.blair;
		}

		else if (this.dialogue[this.dialogueIndex][0] == "Clare Short"){
			this.drawRight = this.clare;
		}

    else if (this.dialogue[this.dialogueIndex][0] == "Rick McSlick"){
			this.drawRight = this.rick;
      tune.volume = 0.7;
      tune.loop = true;
      tune.play();
		}

		this.currTextbox = new TextBox(this.dialogue[this.dialogueIndex][1], this.dialogue[this.dialogueIndex][0]);
    if (this.dialogueSounds[this.dialogueIndex-1]){
      this.dialogueSounds[this.dialogueIndex-1].pause();
    }
		if (this.dialogueSounds[this.dialogueIndex]){
			this.dialogueSounds[this.dialogueIndex].play();
    }
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
	window.setInterval(render, 20);
}

setTimeout(main, 100);

/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var SCREEN_DIM = 0;

function setCanvasSize(){
    var dim = 0;
    
    for (var i=13; i >= 7; i--){
        dim = 1 << i;
        
        if (window.innerHeight > dim && window.innerWidth > dim){
            SCREEN_DIM = dim;
            canvas.width = SCREEN_DIM;
            canvas.height = SCREEN_DIM;
            break;
        }
    }
    
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
}

var Game = {
	
	started : false,
    
    music : document.getElementById("music"),
    epilogue : document.getElementById("epilogue"),
    
    views : {},
	currentView : null,
    
    fadeOutTime : 8,
    fadeOutTimeRemaining : 8,
    fadingOut : false,
    playedEpilogue : false,
    
	intro : function(){
		
	},
	
	init : function(){
		this.intro();
        
        setCanvasSize();
	},
    
    firstUpdate : function(){
        this.addViews();
        AnimationThread.start();
        
        this.currentView = this.views["Wall1"];
        
        this.music.play();
        
        Textbox.setText("Where am I? \n\nIt looks like a bathroom. \n\nI've got to get out of here!");
    },
    
    addViews : function(){
        var toothpaste = new Clickable("Toothpaste", new Rect([0.29, 0.29], [0.15, 0.04]), "A bottle of toothpaste. Some paste is crusted around where the lid should be.");
        var toothbrush = new Clickable("Toothbrush", new Rect([0.54, 0.28], [0.13, 0.04]), "A red toothbrush.");
        var razor = new Clickable("Razor", new Rect([0.67, 0.28], [0.06, 0.08]), "A clean razor. No reason to take it with me.");
        var cabinet_sink = new Clickable("Cabinet_sink", new Rect([0.2, 0], [0.62, 0.16]), "A medicine cabinet.");
        var sink_clickable = new Clickable("Sink", new Rect([0.21, 0.27], [0.60, 0.38]), "A sink");
        
        this.views["Window"] =       
            new View(
                "Window",
                document.getElementById("window"),
                null,
                [
                    new Clickable("Sky", new Rect([0.2, 0.14], [0.59, 0.72]), "The clear blue sky. The tease of freedom.", null, null),
                    new Clickable("Bird shit", new Rect([0.64, 0.22], [0.07, 0.07]), "Eww.", null, null),
                    new Clickable("Handle", new Rect([0.44, 0.41], [0.14, 0.04]), "Damn, it won't open.", null, null),
                    new Clickable("Birds", new Rect([0.28, 0.46], [0.16, 0.13]), "A flock of birds in the distance.", null, null),
                    new Clickable("Bottle", new Rect([0.29, 0.7], [0.07, 0.19]), "A bottle of scented spray. No point in picking it up.", null, null),
                    new Clickable("Tree", new Rect([0.53, 0.63], [0.15, 0.22]), "A proud Oak stands tall in the sky. Or maybe it's a sycamore, or a beech? It's a tree, anyway.", null, null),
                ]
            );
        this.views["Sink_running"] = 
            new View(
                "Sink_running",
                new Animation(document.getElementsByName("sink_running"), 12, false, true),
                document.getElementById("water"),
                [
                    sink_clickable,
                    toothpaste, toothbrush, razor, cabinet_sink,
                    new Clickable("Water", new Rect([0.26, 0.37], [0.51, 0.23]), "Clean water. Too bad I don't have a container for it."),
                ]
            );
        this.views["Sink"] = 
            new View(
                "Sink",
                document.getElementById("sink"),
                null,
                [
                    sink_clickable,
                    new Clickable("Tap", new Rect([0.43, 0.32], [0.16, 0.04]), "I turn on the tap.", this.views["Sink_running"]),
                    toothpaste, toothbrush, razor, cabinet_sink,
                    new Clickable("Drain", new Rect([0.48, 0.43], [0.05, 0.05]), "The drain."),
                    new Clickable("Soap", new Rect([0.54, 0.43], [0.06, 0.04]), "The last remnants of a well used bar of soap."),
                ]
            );
        
        var cabinetClickables = [
            new Clickable("Cabinet", new Rect([0.16, 0.09], [0.62, 0.77]), "A plastic medicine cabinet with a mirror on the front."),
            new Clickable("Mirror", new Rect([0.36, 0.16], [0.38, 0.68]), "That's the one person I didn't want to see right now."),
            new Clickable("bottle1", new Rect([0.23, 0.17], [0.06, 0.08]), "A bottle of Melatonin. Looks like someone's trying to get a summer tan."),
            new Clickable("bottle2", new Rect([0.19, 0.32], [0.05, 0.09]), "\"Anusol\", huh? Sounds exotic."),
            new Clickable("bottle3", new Rect([0.18, 0.48], [0.12, 0.10]), "Lots of odd medications. \"Cardamom\", \"Cumin\", \"Black Pepper\"... Wait a minute."),
            new Clickable("bottle4", new Rect([0.26, 0.65], [0.05, 0.19]), "A huge bottle of whey protein.")
        ]
        
        this.views["Cabinet6"] = 
            new View(
                "Cabinet6",
                document.getElementById("cabinet6"),
                null,
                cabinetClickables.concat([
                    new Clickable("Numbers", new Rect([0.36, 0.16], [0.38, 0.68]), "I wonder what these numbers mean."),
                ])
            );
        
        this.views["Cabinet5"] = 
            new View(
                "Cabinet5",
                document.getElementById("cabinet5"),
                null,
                cabinetClickables.concat([
                    new Clickable("Crack5", new Rect([0.36, 0.16], [0.38, 0.63]), "Oh hey, numbers!", this.views["Cabinet6"], document.getElementById("crack"), function(){ Game.views["Wall1"].clickables[2].newView = Game.views["Cabinet6"]; }),
                ])
            );
        
        this.views["Cabinet4"] = 
            new View(
                "Cabinet4",
                document.getElementById("cabinet4"),
                null,
                cabinetClickables.concat([
                    new Clickable("Crack4", new Rect([0.36, 0.16], [0.37, 0.5]), "Seriously though, there is no way repeatedly punching this mirror could possibly help me get out of here.", this.views["Cabinet5"], document.getElementById("crack"), function(){ Game.views["Wall1"].clickables[2].newView = Game.views["Cabinet5"]; }),
                ])
            );
        
        this.views["Cabinet3"] = 
            new View(
                "Cabinet3",
                document.getElementById("cabinet3"),
                null,
                cabinetClickables.concat([
                    new Clickable("Crack3", new Rect([0.36, 0.16], [0.33, 0.4]), "This is almost as bad as my phone screen.", this.views["Cabinet4"], document.getElementById("crack"), function(){ Game.views["Wall1"].clickables[2].newView = Game.views["Cabinet4"]; }),
                ])
            );
        
        this.views["Cabinet2"] = 
            new View(
                "Cabinet2",
                document.getElementById("cabinet2"),
                null,
                cabinetClickables.concat([
                    new Clickable("Crack2", new Rect([0.36, 0.16], [0.31, 0.29]), "Oh God, my hand is bleeding!", this.views["Cabinet3"], document.getElementById("crack"), function(){ Game.views["Wall1"].clickables[2].newView = Game.views["Cabinet3"]; }),
                ])
            );
        
        this.views["Cabinet1"] = 
            new View(
                "Cabinet1",
                document.getElementById("cabinet1"),
                null,
                cabinetClickables.concat([
                    new Clickable("Crack1", new Rect([0.36, 0.22], [0.16, 0.19]), "Why did I touch it again?", this.views["Cabinet2"], document.getElementById("crack"), function(){ Game.views["Wall1"].clickables[2].newView = Game.views["Cabinet2"]; }),
                ])
            );
        
        this.views["Cabinet0"] = 
            new View(
                "Cabinet0",
                document.getElementById("cabinet0"),
                null,
                cabinetClickables.concat([
                    new Clickable("Crack0", new Rect([0.39, 0.26], [0.05, 0.07]), "Oh crap.", this.views["Cabinet1"], document.getElementById("crack"), function(){ Game.views["Wall1"].clickables[2].newView = Game.views["Cabinet1"]; }),
                ])
            );
        
        this.views["Wall1"] = 
            new View(
                "Wall1",
                document.getElementById("wall1"),
                null,
                [
                    new Clickable("Sink", new Rect([0.156, 0.469], [0.281, 0.156]), "A sink.", this.views["Sink"]),
                    new Clickable("Window", new Rect([0.594, 0.141], [0.336, 0.406]), "A window.", this.views["Window"]),
                    new Clickable("Cabinet", new Rect([0.156, 0], [0.313, 0.421]), "A medicine cabinet.", this.views["Cabinet0"]),
                ]
            );
        
        var card_reader = new Clickable("Card reader", new Rect([0.77, 0.53], [0.11, 0.15]), "A card reader. \"The machines hold all the cards\"");
        
        this.views["Door_closed"] = 
            new View(
                "Door_closed",
                document.getElementById("door_closed"),
                null,
                [
                    new Clickable("Door", new Rect([0.31, 0.22], [0.37, 0.77]), "A large, imposing, wooden door.", null, null),
                    
                    new Clickable("Handle", new Rect([0.59, 0.55], [0.09, 0.09]), "Of course, it's locked.", null, document.getElementById("door_sfx"), function(){ this.text = "Oh wait, it was just stuck."; this.newView = Game.views["Door_open"]; this.sound = document.getElementById("door_sfx_2") }),
                    
                    card_reader,
                    
                ]
            );
        
        this.views["Door_open"] = 
            new View(
                "Door_open",
                document.getElementById("door_open"),
                null,
                [
                    new Clickable("Outside", new Rect([0.31, 0.22], [0.37, 0.77]), "Freedom at last!", null, null, function(){ Game.win(); } ),
                    
                    card_reader,
                ]
            );
        
        this.views["Toilet"] = 
            new View(
                "Toilet",
                document.getElementById("toilet"),
                null,
                [
                    new Clickable("Tank", new Rect([0.24, 0.28], [0.42, 0.21]), "The toilet tank. I could open it, but there obviously won't be anything useful in there."),
                    new Clickable("Toilet", new Rect([0.35, 0.39], [0.22, 0.56]), "That's a toilet alright. Why am I looking at this?"),
                    new Clickable("Flusher", new Rect([0.57, 0.37], [0.08, 0.023]), "The flusher. Pulling it has no effect but to flush the toilet. I really should've expected that.", null, document.getElementById("flush")),
                    new Clickable("Screwdriver", new Rect([0.29, 0.29], [0.13, 0.023]), "Who keeps a screwdriver in their bathroom? This would be useful if there were any screws around to undo."),
                    new Clickable("Paper", new Rect([0.08, 0.43], [0.12, 0.15]), "There might be something written on this toilet paper if I unroll it. I can't be arsed to check."),
                    new Clickable("Bleach", new Rect([0.26, 0.69], [0.08, 0.11]), "A bottle of bleach."),
                    new Clickable("Cactus", new Rect([0.8, 0.53], [0.15, 0.27]), "To paraphrase Don One: \"Yes it's a cactus in a bathroom. So what?\""),
                ]
            );
        
        this.views["Wall2"] = 
            new View(
                "Wall2",
                document.getElementById("wall2"),
                null,
                [
                    new Clickable("Door", new Rect([0.05, 0.12], [0.35, 0.61]), "A door.", this.views["Door_closed"]),
                    new Clickable("Card reader", new Rect([0.43, 0.39], [0.09, 0.13]), "A door.", this.views["Door_closed"]),
                    new Clickable("Toilet", new Rect([0.55, 0.35], [0.43, 0.56]), "A toilet.", this.views["Toilet"]),
                ]
            );
        
        this.views["Window"].back = this.views["Wall1"];
        this.views["Sink"].back = this.views["Wall1"];
        this.views["Sink_running"].back = this.views["Wall1"];
        
        this.views["Cabinet0"].back = this.views["Wall1"];
        this.views["Cabinet1"].back = this.views["Wall1"];
        this.views["Cabinet2"].back = this.views["Wall1"];
        this.views["Cabinet3"].back = this.views["Wall1"];
        this.views["Cabinet4"].back = this.views["Wall1"];
        this.views["Cabinet5"].back = this.views["Wall1"];
        this.views["Cabinet6"].back = this.views["Wall1"];
        
        this.views["Door_closed"].back = this.views["Wall2"];
        this.views["Door_open"].back = this.views["Wall2"];
        this.views["Toilet"].back = this.views["Wall2"];
        
        this.views["Wall1"].back = this.views["Wall2"];
        this.views["Wall2"].back = this.views["Wall1"];
        
        this.views["Sink_running"].clickables.push(new Clickable("Tap", new Rect([0.43, 0.32], [0.16, 0.04]), "I turn off the tap.", this.views["Sink"]));
    },
    
    win : function(){
        this.fadingOut = true;
        console.log(this.fadingOut);
    },
	
	update : function(){
		
		if (! this.started){
			if (allAssetsLoaded()){
				this.started = true;
                this.firstUpdate();
			}
			
			return;
		}
        
        Textbox.update(deltaTime);
        
        if (this.fadingOut && this.fadeOutTimeRemaining > 0){ 
            this.fadeOutTimeRemaining = Math.max(0, this.fadeOutTimeRemaining-deltaTime);
        }
        
        ctx.globalAlpha = this.fadeOutTimeRemaining / this.fadeOutTime;
        this.music.volume = this.fadeOutTimeRemaining / this.fadeOutTime;
        
        if (this.fadeOutTimeRemaining <= 0 && !this.playedEpilogue){
            this.epilogue.play();
            this.playedEpilogue = true;
        }
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}
        
        this.renderCurrentView();
        //this.drawClickableBounds();
        Textbox.draw(ctx);
        if (this.currentView.back) BackArrow.draw(ctx, mousePos, SCREEN_DIM);
	},
    
    setCurrentView : function(view){
        if (this.currentView.sound){
            this.currentView.sound.pause();
        }
        
        this.currentView = view;
        
        if (this.currentView.sound){
            this.currentView.sound.play();
        }
    },
    
    renderCurrentView : function(){
        this.currentView.render.draw(ctx, [0, 0], [SCREEN_DIM, SCREEN_DIM]);
    },
    
    drawClickableBounds : function(){
        var i = this.currentView.clickables.length;
        
        while (i--){
            this.currentView.clickables[i].bounds.copy().scale(SCREEN_DIM).draw(ctx, 1, "#FF0000");
        }
    },

    onClick : function(){
        if (BackArrow.checkClick(mousePos, SCREEN_DIM) && this.currentView.back){
            this.setCurrentView(this.currentView.back);
            Textbox.setText("");
        }
        
        var clickable = this.currentView.checkClickables(mousePos);
        
        if (!clickable){
            return;
        }
        
        if (clickable.text) Textbox.setText(clickable.text);
        if (clickable.newView) this.setCurrentView(clickable.newView);
        clickable.activate();
    }
}

window.onresize = setCanvasSize;
canvas.onmousedown = function() { Game.onClick(); };

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

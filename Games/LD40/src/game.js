/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

function setCanvasSize(){
    /*var x = 0;
    
    for (var i=13; i >= 7; i--){
        dim = 1 << i;
        
        if (window.innerHeight > dim && window.innerWidth > dim){
            SCREEN_DIM = dim;
            canvas.width = SCREEN_DIM;
            canvas.height = SCREEN_DIM;
            break;
        }
        }*/

    var width  = 0;
    var height = 0;
    
    for (var i=20; i > 0; i--){
        width = 192 * i;
        height = 108 * i;

        if (window.innerWidth > width && window.innerHeight > height){
            canvas.width = width;
            canvas.height = height;
            break;
        }
    }
    
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
}

function scaleRect(rect){
    var scaled = rect.copy();
    scaled.pos.x  *= canvas.width;
    scaled.size.x *= canvas.width;
    scaled.pos.y  *= canvas.height;
    scaled.size.y *= canvas.height;

    return scaled;
}

function squareToScreen(v2){
    var result = new Vector2(0, 0);
    
    var ratio = canvas.height / canvas.width;
    
    result[0] = v2[0] * ratio;
    result[1] = v2[1];
    
    return result;
}

function squareToScreenRect(rect){
    rect.pos  = squareToScreen(rect.pos);
    rect.size = squareToScreen(rect.size);
}

function toUnit(v2){
    v2[0] /= 192;
    v2[1] /= 108;

    return v2;
}

function makeUnitRect(x, y, w, h){
    return new Rect([x/192, y / 108], [w / 192, h / 108]);
}

function makeUnitRectSquare(x, y, w, h){
    return new Rect([(x+42) / 192, y / 108], [w / 192, h / 108])
}

var Game = {
	
    started : false,
    
    music : document.getElementById("music"),
    
    views : {},
    currentView : null,

    cursor : document.getElementById("cursor"),
    cursorScale : squareToScreen([0.1, 0.1]),
    
    fadeOutTime : 10,
    fadeOutTimeRemaining : 10,
    fadingOut : false,
    playedEpilogue : false,

    lamp_off : null,
    lamp_on : null,

    backArrow : new Arrow(
        document.getElementById("back_arrow_low"),
        document.getElementById("back_arrow_high"),
        new Rect([0.443, 0.888], [0.099, 0.093]),
    ),

    leftArrow : new Arrow(
        document.getElementById("left_arrow_low"),
        document.getElementById("left_arrow_high"),
        new Rect([0.021, 0.380], [0.052, 0.176]),
    ),

    rightArrow : new Arrow(
        document.getElementById("right_arrow_low"),
        document.getElementById("right_arrow_high"),
        new Rect([0.927, 0.380], [0.052, 0.176]),
    ),
    
    intro : function(){
		
    },
    
    init : function(){
	this.intro();
        
        setCanvasSize();

        this.cursorScale = squareToScreen([0.1, 0.1]);

        document.getElementById("snore").volume = 0.2;
        document.getElementById("ending").volume = 0.5;
        document.getElementById("jazz").volume = 0.4;
    },
    
    firstUpdate : function(){
        this.addViews();
        AnimationThread.start();
        
        this.currentView = this.views[Random.choice(["Hallway1", "Hallway2", "Hallway3"])];
        
        this.music.play();
        
        Textbox.setText("I find myself rather hard up at the moment. Dreadfully hard up, in fact. Details aren't important, a couple of investments didn't go my way, is all. \nI've invited myself round to Dad's to see if he's got much lying around that I could slip away with. He's a old fool of an invalid, and he's got more money than he could ever find a use for. \nI'll have a quick rummage around, pocket what I can see and make my way home for tea.");
    },
    
    addViews : function(){

        var big_gold_key = new Item(
            "Gold Key",
            makeUnitRect(160, 51, 12, 12),
            document.getElementById("gold_key"),
            "A there was a gold key under the lampshade.",
            null,
            true,
            0,
            true,
            function() {
                Game.views["Bedroom41"].render = new Animation([document.getElementById("bedroom42")], 0, false);
            },
            true,
        );

        var tiny_key = new Item(
            "Tiny Key",
            makeUnitRect(163, 80, 15, 15),
            document.getElementById("tiny_key"),
            "A tiny key, how odd.",
            null,
            true,
            0,
            true,
            function(){
                Game.setCurrentView(Game.views["Box3"]);
                Game.views["Bedroom3"].clickables[1].newView = Game.views["Box3"];
            },
        );

        var cash_stack = new Item(
            "Cash Stack",
            new Rect([.203, .869], squareToScreen([.08, .08])),
            document.getElementById("cash_stack"),
            "A handy pile of cash, sitting out on the bookshelf. Don't mind of I do.",
            null,
            false,
            500,
        );

        var pillow = new Item(
            "Pillow",
            makeUnitRect(99, 63, 26, 26),
            document.getElementById("pillow"),
            "This pillow might be useful.",
            null,
            true,
        );

        var screwdriver = new Item(
            "Screwdriver",
            makeUnitRectSquare(17, 48, 24, 24),
            document.getElementById("screwdriver"),
            "This screwdriver could find a use.",
            null,
            true,
        );

        var medicine = new Item(
            "Sleeping Draught",
            makeUnitRect(67, 80, 20, 20),
            document.getElementById("medicine"),
            "It's Dad's sleeping draught. Could be handy.",
            null,
            true,
        );

        var hammer = new Item(
            "Hammer",
            makeUnitRectSquare(55, 50, 24, 24),
            document.getElementById("hammer"),
            "I could employ this hammer.",
            null,
            true,
        );

        var matches = new Item(
            "Matches",
            makeUnitRectSquare(62, 49, 16, 16),
            document.getElementById("matches"),
            "Mayhap these matches might make me merry.",
            null,
            true,
        );

        var placeholder_item = new Item();

        this.views["Drawer1"] =
            new View(
                "Drawer1",
                document.getElementById("drawer"),
                null,
                [
                    
                ],
                [
                    
                ],
                true,
            );

        this.views["Drawer2"] =
            new View(
                "Drawer2",
                document.getElementById("drawer"),
                null,
                [
                    
                ],
                [
                    matches,
                ],
                true,
            );
        this.views["Drawer3"] =
            new View(
                "Drawer3",
                document.getElementById("drawer"),
                null,
                [
                    
                ],
                [
                    new Item(
                        "Watch",
                        makeUnitRectSquare(26, 41, 24, 24),
                        document.getElementById("watch"),
                        "Ah, the old man's watch. Not like he has any need for it these days.",
                        null,
                        false,
                        325,
                    ),
                ],
                true,
            );
        this.views["Drawer4"] =
            new View(
                "Drawer4",
                document.getElementById("drawer"),
                null,
                [
                    
                ],
                [
                    new Item(
                        "Necklace",
                        makeUnitRectSquare(38, 30, 24, 24),
                        document.getElementById("necklace"),
                        "Quite an ugly necklace, mother usually had better taste than this. father must have bought it for her.",
                        null,
                        false,
                        160,
                    ),
                ],
                true,
            );
        
        this.views["Chest"] =
            new View(
                "Chest",
                document.getElementById("chest"),
                null,
                [
                    
                ],
                [
                    screwdriver,
                    hammer,
                ],
                true,
            ),

        this.views["Study1"] =
            new View(
                "Study1",
                document.getElementById("study1"),
                null,
                [
                    new Clickable(
                        "Drawers",
                        makeUnitRect(21, 61, 110, 47),
                        "A wooden chest of drawers. Might be worth my while having a look in here.",
                    ),

                    new Clickable(
                        "Drawer 1",
                        makeUnitRect(22, 75, 94, 10),
                        "I wonder what we have in here",
                        this.views["Drawer1"],
                    ),

                    new Clickable(
                        "Drawer 2",
                        makeUnitRect(22, 89, 94, 10),
                        "Anything in here of note?",
                        this.views["Drawer2"],
                    ),

                    new Clickable(
                        "Door",
                        makeUnitRect(141, 36, 37, 71),
                        "The door leading to the Hallway.",
                        
                    ),

                    new Clickable(
                        "Door Handle",
                        makeUnitRect(160, 65, 16, 16),
                        "",
                        null,
                        document.getElementById("door_sfx_2"),
                        function(){ Game.setCurrentView(Game.views["Hallway1"]); },
                    ),
                    
                    new Clickable(
                        "Vase",
                        new Rect([0.156, 0.426], [0.052, 0.176]),
                        "A purple vase with a single, wilted flower inside. Old dad never was much for nurturing."
                    ),

                    new Clickable(
                        "Painting",
                        makeUnitRect(84, 29, 32, 21),
                        "A landscape painting Dad bought in Italy in his youth. I never understood it really, I suppose the blocky style must symbolise something.",
                    ),
                ],
                [
                    
                ],
            );

        this.views["Drawer1"].back = this.views["Study1"];
        this.views["Drawer2"].back = this.views["Study1"];

        this.views["Study2"] =
            new View(
                "Study2",
                document.getElementById("study2"),
                null,
                [
                    new Clickable(
                        "Chest",
                        new Rect([0.651, 0.639], [0.276, 0.361]),
                        "This chest is locked, but I'll wager the old man has something nice stashed in here. I should look for the key.",
                        null,
                        null,
                        null,
                        big_gold_key,
                        "The key opens the chest.",
                        null,
                        function() {
                            Game.views["Study2"].render = new Animation([document.getElementById("study2_chest_open")], 0, false);
                            Game.views["Study2"].clickables[0] = new Clickable(
                                "Open Chest",
                                new Rect([0.651, 0.550], [0.276, 0.450]),
                                "Ah, dad's old tools. Suppose he doesn't have much use for these anymore. Still, not much value.",
                                Game.views["Chest"], // Change soon
                            )
                        },
                    ),

                    new Clickable(
                        "Book Case",
                        makeUnitRect(28, 34, 68, 73),
                        "A mahogany book case. I think it dreadfully big for how few books it could store, entirely impractical.",
                    ),

                    new Clickable(
                        "Encyclopedia",
                        makeUnitRect(31, 52, 48, 11),
                        "The Encyclopedia Brittanica, Ninth Edition. Dad lost most of the volumes moving house, not as though he has much use for them these days.",
                    ),

                    new Clickable(
                        "Great War Book",
                        makeUnitRect(34, 71, 10, 12),
                        "\"The Great War 1914-1918: Lessons and Losses.\", Thank goodness that's over, and praise God I was able to shirk it.",
                    ),

                    new Clickable(
                        "Will",
                        makeUnitRect(68, 79, 8, 9),
                        "Hullo, what's this?\nIt's Dad's will! Let's have a look then, shall we?\n\n\"...bequeath my entire estate to my son, my only living relative and the only one I can trust.\"\n\nWell, that's a relief.",
                    ),

                    new Clickable(
                        "Parenting book",
                        makeUnitRect(70, 77, 9, 7),
                        "\"Miss Leslie's Guide to The Proper Raising and Disciplining of Children.\", it's rather the worse for wear.",
                    ),

                    new Clickable(
                        "Maths book",
                        makeUnitRect(59, 71, 15, 8),
                        "\"Vector Analysis and Quaternions\", Dad always did like that old maths. I can't stand it myself, pointless stuff unless you're an accountant."
                    )
                    
                ],
                [
                    cash_stack,
                ],
            )

        this.views["Chest"].back = this.views["Study2"];

        var study3_common_clickables = [
            new Clickable(
                "Chair",
                makeUnitRect(62, 60, 26, 48),
                "Dad's Chair. It used to be at the desk, but he never sits there these days.",
            ),

            new Clickable(
                "Pillow",
                makeUnitRect(64, 65, 22, 20),
                "A pillow on the chair. Dad's always complaining about his back.",
            ),
        ];

        this.views["Study31"] =
            new View(
                "Study31",
                document.getElementById("study3_dadbed"),
                null,
                [
                    
                ].concat(study3_common_clickables),
                [
                    new Item(
                        "Record",
                        makeUnitRect(141, 69, 30, 11),
                        document.getElementById("record"),
                        "I can grab this now that dad isn't listening to it.",
                        null,
                        false,
                        60,
                    ),

                    new Item(
                        "Dad",
                        makeUnitRect(24, 54, 24, 54),
                        document.getElementById("dad"),
                        "I need something to help me get to sleep.",
                        null,
                        null,
                        0,
                        false,
                        function(){
                            Game.views["Bedroom20"].left = Game.views["Bedroom40_dadbed"];
                            Game.views["Bedroom21"].left = Game.views["Bedroom40_dadbed"];
                            Game.views["Bedroom3"].right = Game.views["Bedroom40_dadbed"];
                            Game.views["Hallway1"].clickables[1].newView = Game.views["Bedroom40_dadbed"];
                        },
                        false,
                        medicine,
                        "Alright, I'll go off to bed now.",
                    ),
                ],
            );

        this.views["Study30"] =
            new View(
                "Study30",
                new Animation([document.getElementById("study3_f1"),
                               document.getElementById("study3_f2")],
                              2.5),
                document.getElementById("jazz"),
                [
                    new Clickable(
                        "Dad",
                        makeUnitRect(24, 51, 18, 32),
                        "I'm glad you've come to visit, son. I find myself getting rather lonely of late. It's nice to hear some familiar footsteps around the house.",
                        // Make him say different stuff?

                        null,
                        null,
                        null,
                        medicine,
                        "What's this, my sleeping draught? Time for bed already, is it? Fair enough. \nOnly bother is, that blasted gramophone is broken. It won't shut up no matter what I do. I can't just pull the record out since it would get scratched.\nI fancy it's a loose screw, but I've no way to be sure. Could you have a look at it?",
                        null,
                        function(){
                            Game.views["Study30"].clickables[1].text = "I've got to shut this thing up before Dad will go to bed. Loose screw, he says.";
                            Game.views["Study30"].clickables[1].reqItem = screwdriver;
                        },
                    ),

                    new Clickable(
                        "Gramophone",
                        makeUnitRect(135, 45, 41, 63),
                        "Dad loves that gramophone, I suppose it's one of the few pleasures he's got left. That record is probably worth something, but I can't take it while dad's here.",
                        null,
                        null,
                        null,
                        placeholder_item,
                        "That ought to shut it up",
                        this.views["Study31"],
                        function(){
                            Game.views["Study2"].right = Game.views["Study31"];
                            Game.views["Study4"].left  = Game.views["Study31"];
                            Game.views["Hallway2"].clickables[1].newView = Game.views["Study31"];
                        },
            ),
                    
                ].concat(study3_common_clickables),
                [
                    
                ],
                false,
                true,
            )

        this.views["Study4"] =
            new View(
                "Study4",
                document.getElementById("study4"),
                null,
                [
                    new Clickable(
                        "Desk",
                        makeUnitRect(38, 56, 122, 52),
                        "Dad's writing desk."
                    ),

                    new Clickable(
                        "Desk Drawer",
                        makeUnitRect(99, 71, 40, 15),
                        "Now I wonder what the old man's got stashed in here.",
                        this.views["Drawer3"],
                    ),
                ],
                [
                    
                ],
            )

        this.views["Drawer3"].back = this.views["Study4"];

        //this.views["Study1"].back = this.views["Study1"];
        //this.views["Study1"].left = this.views["Study1"];
        this.views["Study1"].right = this.views["Study2"];
        this.views["Study1"].left  = this.views["Study4"];
        this.views["Study2"].left  = this.views["Study1"];
        this.views["Study2"].right = this.views["Study30"];
        this.views["Study30"].left  = this.views["Study2"];
        this.views["Study30"].right = this.views["Study4"];
        this.views["Study31"].left  = this.views["Study2"];
        this.views["Study31"].right = this.views["Study4"];
        this.views["Study4"].left  = this.views["Study30"];
        this.views["Study4"].right = this.views["Study1"];

        this.views["Box6"] =
            new View(
                "Box6",
                document.getElementById("box6"),
                null,
                [
                    new Clickable(
                        "Photo",
                        makeUnitRect(110, 9, 37, 52),
                        "My mother was quite pretty in her youth, I suppose. These jewels must be worth something though. Perhaps they're antique by now.",
                    ),
                ],
                [
                    new Item(
                        "Ring",
                        makeUnitRect(55, 83, 24, 24),
                        document.getElementById("ring"),
                        "A lovely ruby ring, vary flash. It's not as though anyone will miss it.",
                        null,
                        false,
                        1200,
                    ),
                    new Item(
                        "Brooch",
                        makeUnitRect(90, 80, 24, 24),
                        document.getElementById("brooch"),
                        "A pink butterfly brooch. I remeber mum would always waer it during bridge games. I wonder what I'll get for this beauty.",
                        null,
                        false,
                        700,
                    ),
                    new Item(
                        "Earrings",
                        makeUnitRect(120, 80, 24, 24),
                        document.getElementById("earrings"),
                        "Deep blue teardrop earrings. Modelled after the famous \"Tear of Emanon\", I should think.",
                        null,
                        false,
                        950,
                    ),
                ],
            ),
        this.views["Box5"] = 
            new View(
                "Box5",
                document.getElementById("box5"),
                null,
                [
                    new Clickable(
                        "Keyhole",
                        makeUnitRect(83, 36, 26, 38),
                        "What do I do with this little hole again?",
                        null,
                        null,
                        null,
                        tiny_key,
                        "Ah right, it was a key hole.",
                        this.views["Box6"],
                        function(){
                            Game.views["Bedroom3"].clickables[1].newView = Game.views["Box6"];
                        }
                    ),
                ],
                [
                    
                ],
            );

        this.views["Box4"] =
            new View(
                "Box4",
                document.getElementById("box4"),
                null,
                [
                    new Clickable(
                        "Slat",
                        makeUnitRect(83, 56, 26, 38),
                        "And this slat slides out, I remember now!",
                        this.views["Box5"],
                        null,
                        function(){
                            Game.views["Bedroom3"].clickables[1].newView = Game.views["Box5"];
                        }
                    ),
                ],
                [
                    
                ],
            );

         this.views["Box3"] =
            new View(
                "Box3",
                document.getElementById("box3"),
                null,
                [
                    new Clickable(
                        "Bottom",
                        makeUnitRect(16, 76, 166, 24),
                        "Now the bottom slides back.",
                        this.views["Box4"],
                        null,
                        function(){
                            Game.views["Bedroom3"].clickables[1].newView = Game.views["Box4"];
                        }
                    ),
                ],
                [
                    
                ],
            );

        this.views["Box2"] =
            new View(
                "Box2",
                document.getElementById("box3"),
                null,
                [
                    
                ],
                [
                    tiny_key,
                ],
            );
        
        this.views["Box1"] =
            new View(
                "Box1",
                document.getElementById("box1"),
                null,
                [
                    new Clickable(
                        "Slit",
                        makeUnitRect(175, 79, 16, 19),
                        "Ah, this part slides open.",
                        this.views["Box2"],
                        null,
                        function(){
                            Game.views["Bedroom3"].clickables[1].newView = Game.views["Box2"];
                        }
                    ),
                ],
                [
                    
                ],
            );

        this.views["Bedroom1"] =
            new View(
                "Bedroom1",
                document.getElementById("bedroom1"),
                null,
                [
                    new Clickable(
                        "Door",
                        makeUnitRect(121, 33, 44, 75),
                        "The door to the hallway.",
                    ),

                    new Clickable(
                        "Handle",
                        makeUnitRect(120, 66, 16, 16),
                        "",
                        null,
                        door_sfx_2,
                        function(){ Game.setCurrentView(Game.views["Hallway3"]); },
                    ),

                    new Clickable(
                        "Sofa",
                        makeUnitRect(28, 73, 76, 28),
                        "A sofa."
                    ),
                ],
                [
                    new Item(
                        "Sofa Change",
                        makeUnitRect(28, 73, 76, 28),
                        null,
                        "Yes, there are a few coins in here.",
                        null,
                        false,
                        4,
                        false,
                        null,
                        true,
                    ),
                    new Item(
                        "Sofa Initial",
                        makeUnitRect(28, 73, 76, 28),
                        null,
                        "I say, I wonder whether I could find some loose change amongst the cushions of this sofa.",
                        null,
                        false,
                        0,
                        false,
                        null,
                        true,
                    ),
                ],
            );

        this.views["Bedroom21"] =
            new View(
                "Bedroom21",
                document.getElementById("bedroom21"),
                null,
                [
                    new Clickable(
                        "Wardrobe",
                        makeUnitRect(150, 38, 39, 70),
                        "A wardrobe",
                    ),
                ],
                [
                    new Item(
                        "Piggy Bank",
                        makeUnitRect(146, 81, 32, 27),
                        null,
                        "My piggy bank from when I was a child, I haven't seen this in ages!",
                        null,
                        false,
                        17,
                        false,
                        function(){
                            Game.views["Bedroom21"].render = new Animation([document.getElementById("bedroom22")], 0, false);
                            document.getElementById("crack").play();
                        },
                        true,
                        hammer,
                        "Ah yes, plenty of change in here",
                        null,
                    ),
                    
                ],
            );
        
        this.views["Bedroom20"] =
            new View(
                "Bedroom20",
                document.getElementById("bedroom20"),
                null,
                [
                    new Clickable(
                        "Wardrobe",
                        makeUnitRect(150, 38, 39, 70),
                        "A wardrobe",
                    ),
                    new Clickable(
                        "Handle",
                        makeUnitRect(150, 75, 16, 16),
                        "Let's have a look in here.",
                        this.views["Bedroom21"],
                    ),
                ],
                [
                    
                ],
            );

        this.views["Bedroom3"] =
            new View(
                "Bedroom3",
                document.getElementById("bedroom3"),
                null,
                [
                    
                    new Clickable(
                        "Mirror",
                        makeUnitRect(83, 45, 31, 30),
                        "This is a simply exquisite mirror, and there's a damned handsome devil in it. I wonder if I could take this back to mine later, not as though the old man has any use for it.",
                    ),
                    
                    new Clickable(
                        "Jewellery Box",
                        makeUnitRect(103, 77, 14, 5),
                        "My mother's jewellery box, how do you open this thing again?",
                        this.views["Box1"],
                    ),
                    
                    new Clickable(
                        "Drawers",
                        makeUnitRect(78, 85, 42, 22),
                        "Let's see what's hiding in here.",
                        this.views["Drawer4"],
                    ),

                    new Clickable(
                        "Window1",
                        makeUnitRect(144, 36, 27, 49),
                        "The gardens are lovely at this place, I really can't wait until I inherit it.",
                    ),

                    new Clickable(
                        "Window2",
                        makeUnitRect(30, 36, 27, 49),
                        "I can see the Thatchburys' house from here. Queer folk they are, always poking their noses in around here. Dad likes them of course, he would do. I remember the last time they came around here, playing bridge with dad. Of course, I was left whispering dad's cards to him, I could never play bridge. Damn nuciance it was, so I told them on no uncertain terms to clear out. Well, that did the trick. Damn rum looking old house, as well.",
                    ),
                ],
                [
                    
                ],
            );

        this.views["Drawer4"].back = this.views["Bedroom3"] ;

        var bedroom4_common_clickables = [
            new Clickable(
                "Side Table 1",
                makeUnitRect(19, 74, 20, 34),
                "My father's side table. It must help him find his way to bed, if nothing else.",
            ),
            new Clickable(
                "Side Table 2",
                makeUnitRect(153, 74, 20, 34),
                "My mother's side table. It's gathered a lot of dust.",
            ),
            new Clickable(
                "Magazines 1",
                makeUnitRect(24, 92, 7, 18),
                "I suppose no-one reads these anymore.",
            ),
            new Clickable(
                "Magzines 2",
                makeUnitRect(159, 92, 7, 18),
                "A lot old magazines, years out of date.",
            ),
        ];

        this.views["Bedroom41"] =
            new View(
                "Bedroom4",
                document.getElementById("bedroom41"),
                null,
                [
                    new Clickable(
                        "Lamp",
                        makeUnitRect(156, 52, 14, 21),
                        "I turn off the lamp.",
                        null,
                        null,
                        function() { Game.setCurrentView(Game.views["Bedroom40"]) },
                    ),
                    
                    new Clickable(
                        "Bed",
                        makeUnitRect(62, 62, 69, 42),
                        "My parents' bed. The right side is messy but the left is immaculate.",
            ),
                ].concat(bedroom4_common_clickables),
                [
                    big_gold_key,
                ],
            );

        this.views["Bedroom40"] =
            new View(
                "Bedroom4",
                document.getElementById("bedroom40"),
                null,
                [
                    new Clickable(
                        "Lamp",
                        makeUnitRect(156, 52, 14, 21),
                        "I turn on the lamp.",
                        this.views["Bedroom41"],
                    ),
                    
                    new Clickable(
                        "Bed",
                        makeUnitRect(62, 62, 69, 42),
                        "My parents' bed. The left side is messy but the right is immaculate.",
            ),
                ].concat(bedroom4_common_clickables),
                [
                    
                ],
            );

        this.lamp_off = new Clickable(
            "Lamp Off",
            makeUnitRect(155, 51, 16, 21),
            "I switch on the lamp",
            null,
            null,
            function(){
                Game.views["Bedroom40_dadbed"].render = new Animation([document.getElementById("bedroom41_dadbed")], 0, false);
                Game.views["Bedroom40_dadbed"].clickables[0] = Game.lamp_on;
            },
        );

        this.lamp_on = new Clickable(
            "Lamp On",
            makeUnitRect(155, 51, 16, 21),
            "I switch off on the lamp",
            null,
            null,
            function(){
                Game.views["Bedroom40_dadbed"].render = new Animation([document.getElementById("bedroom40_dadbed")], 0, false);
                Game.views["Bedroom40_dadbed"].clickables[0] = Game.lamp_off;
            },
        );

        this.views["Bedroom40_dadbed"] =
            new View(
                "Bedroom4_dadbed",
                document.getElementById("bedroom40_dadbed"),
                document.getElementById("snore"),
                [
                    this.lamp_off,

                    new Clickable(
                        "Bed",
                        makeUnitRect(61, 61, 72, 43),
                        "My parent's bed. It feels big with only dad in it.",
                    ),

                    new Clickable(
                        "Dad",
                        makeUnitRect(65, 65, 30, 30),
                        "He looks cold.",
                        null,
                        null,
                        null,
                        pillow,
                        "...",
                        null,
                        function(){Game.win();},
                    ),
                    
                ].concat(bedroom4_common_clickables),
                [
                    pillow,
                ],
                false,
            ),

        this.views["Bedroom1"].left   = this.views["Bedroom20"];
        this.views["Bedroom1"].right  = this.views["Bedroom3"];
        this.views["Bedroom20"].left  = this.views["Bedroom40"];
        this.views["Bedroom20"].right = this.views["Bedroom1"];
        this.views["Bedroom21"].left  = this.views["Bedroom40"];
        this.views["Bedroom21"].right = this.views["Bedroom1"];
        this.views["Bedroom3"].left   = this.views["Bedroom1"];
        this.views["Bedroom3"].right  = this.views["Bedroom40"];
        this.views["Bedroom40"].left  = this.views["Bedroom3"];
        this.views["Bedroom40"].right = this.views["Bedroom20"];
        this.views["Bedroom41"].left  = this.views["Bedroom3"];
        this.views["Bedroom41"].right = this.views["Bedroom20"];
        this.views["Bedroom40_dadbed"].left  = this.views["Bedroom3"];
        this.views["Bedroom40_dadbed"].right = this.views["Bedroom20"];
        
        this.views["Box1"].back = this.views["Bedroom3"];
        this.views["Box2"].back = this.views["Bedroom3"];
        this.views["Box3"].back = this.views["Bedroom3"];
        this.views["Box4"].back = this.views["Bedroom3"];
        this.views["Box5"].back = this.views["Bedroom3"];
        this.views["Box6"].back = this.views["Bedroom3"];

        this.views["Cabinet"] =
            new View(
                "Cabinet",
                document.getElementById("cabinet"),
                null,
                [
                    
                ],
                [
                    medicine,
                ],
            );

        var DR1_common_clickables = [
            new Clickable(
                "Poster",
                makeUnitRect(141, 21, 46, 57),
                "A picture my father bought while on holiday in the orient. When he bought it he told me he thought it was a sunrise, but now he says it seems more like a sunset.",
            ),
        ];

        this.views["DR1_ashes"] =
            new View(
                "Dining Room 1 Ashes",
                document.getElementById("dr1_ashes"),
                null,
                [
                    new Clickable(
                        "Fireplace",
                        makeUnitRect(36, 51, 61, 57),
                        "The fire is burnt out now.",
                    ),
                ].concat(DR1_common_clickables),
                [
                    new Item(
                        "Gold Bar",
                        makeUnitRect(55, 92, 24, 24),
                        document.getElementById("gold_bar"),
                        "A bar of gold hidden under the firewood. Dad must have been keeping it in case he needed to flee to Spain.",
                        null,
                        false,
                        2600,
                        
                    ),
                ]
            ),

        this.views["DR1"] =
            new View(
                "Dining Room 1",
                document.getElementById("dr1"),
                null,
                [
                    new Clickable(
                        "Fireplace",
                        makeUnitRect(36, 51, 61, 57),
                        "The fireplace. An old-fashioned wood burner.",
                        null,
                        null,
                        null,
                        matches,
                        "I set a fire. Not sure what good that'll do.",
                        null,
                        function(){
                            Game.views["DR1"].render = new Animation([document.getElementById("dr1_fire1"), document.getElementById("dr1_fire2")], 2, false);
                            Game.views["DR2"].right = Game.views["DR1_ashes"];
                            Game.views["DR3"].left = Game.views["DR1_ashes"];

                        }
                    ),
                ].concat(DR1_common_clickables),
                [
                    
                ],
            );

        this.views["DR2"] =
            new View(
                "Dining Room 2",
                document.getElementById("dr2"),
                null,
                [
                    new Clickable(
                        "Table",
                        makeUnitRect(9, 48, 182, 60),
                        "It seems a large table for a family of three, but mother was always throwing parties and having people over for raucous games of cards. It does seem rather empty now. ",
                    ),
                    new Clickable(
                        "Candelabra",
                        makeUnitRect(89, 41, 28, 28),
                        "I never liked the look of this candle holding contraption. Always seemed a bit semitic to me.",
                    ),
                    new Clickable(
                        "Tray",
                        makeUnitRect(39, 55, 12, 14),
                        "This will be the cloche from dad's lunch. I wonder if there's anything left.",
                    ),
                ],
                [
                    
                ],
            );

        this.views["DR3"] =
            new View(
                "Dining Room 3",
                document.getElementById("dr3"),
                null,
                [
                    new Clickable(
                        "Door",
                        makeUnitRect(67, 33, 44, 75),
                        "The door to the hallway",
                    ),

                    new Clickable(
                        "Handle",
                        makeUnitRect(65, 65, 17, 17),
                        "",
                        null,
                        door_sfx_2,
                        function(){
                            Game.setCurrentView(Game.views["Hallway2"]);
                        },
                    ),

                    new Clickable(
                        "Clock",
                        makeUnitRect(9, 26, 28, 82),
                        "Ah, it's just gone 3 o' Clock. I'd better get a move on if I want to be home for tea. Father's cook is an old dear but she can't do half what she used to. I don't see why he keeps her on, much longer and he'll end up having to leave her a legacy.",
                    ),
                ],
                [
                    new Item(
                        "Diamond",
                        makeUnitRect(144, 48, 16, 16),
                        document.getElementById("diamond"),
                        "",
                        null,
                        false,
                        4300,
                        false,
                        null,
                        true,
                        placeholder_item,
                    ),
                    
                    new Item(
                        "Bust",
                        makeUnitRect(148, 44, 12, 19),
                        document.getElementById("bust"),
                        "Dad's bust of Plato. He used to love all that stuff. All the old philosophers, but especially Plato. Dad thought Plato had a diamond brain.  Personally I think the classics are a load of old claptrap. No use looking two millenia in to the past for knowledge when we live in so very modern times.",
                        null,
                        null,
                        0,
                        false,
                        function(){
                            document.getElementById("crack").play();
                            Game.views["DR3"].items[0].invis = false;
                            Game.views["DR3"].items[0].reqItem = null;
                        },
                        false,
                        hammer,
                        "Take this, Plato!"
                    ),
                ],
            );

        this.views["DR4"] =
            new View(
                "Dining Room 4",
                document.getElementById("dr4"),
                null,
                [
                    new Clickable(
                        "Unit",
                        makeUnitRect(48, 22, 90, 86),
                        "A grandiose mahogany unit on which Mother's collection of oriental crockery is kept. The servants keep it clean, of course, but father has no need of it now.",
                    ),
                    
                    new Clickable(
                        "Cabinet",
                        makeUnitRect(51, 75, 26, 22),
                        "I wonder what's in here.",
                        this.views["Cabinet"],
                    ),

                    new Clickable(
                        "Cabinet",
                        makeUnitRect(108, 75, 26, 22),
                        "I wonder what's in here.",
                        this.views["Cabinet"],
                    ),

                    new Clickable(
                        "Bass",
                        makeUnitRect(4, 28, 31, 12),
                        "Dad's prize-winning bass. He's always talking about that thing, jolly annoying it is.",
                    ),

                    new Clickable(
                        "Goldfish",
                        makeUnitRect(11, 50, 25, 9),
                        "My \"best catch\" from mine and dad's only fishing trip. This display is his idea of humour. I bloody well hate fishing. Hours in a stinking boat, bored stiff waiting for a fish to waltz up and commit suicide.",
                    ),

                    new Clickable(
                        "Rifle",
                        makeUnitRect(156, 52, 22, 56),
                        "Dad's old hunting rifle. He shouldn't keep this around anymore, It's nothing but a hazard. What if he stumbles in to it while I'm eating supper and I get shot?",
                    ),
                    
                ],
                [
                    new Item(
                        "Bass Pearl",
                        makeUnitRect(4, 28, 31, 12),
                        null,
                        "A big pearl popped out of its mouth when I poked it, this will make a nice addition to the kitty.",
                        
                        null,
                        false,
                        80,
                        false,
                        null,
                        true,
                    ),
                    new Item(
                        "Bass Initial",
                        makeUnitRect(4, 28, 31, 12),
                        null,
                        "That fish has an awfully strange bulge in it's stomach, perhaps I'll investigate.",
                        null,
                        false,
                        0,
                        false,
                        null,
                        true,
                    ),
                ],
            );

        this.views["Cabinet"].back = this.views["DR4"];

        this.views["DR1"].left = this.views["DR2"];
        this.views["DR1"].right = this.views["DR3"];
        this.views["DR1_ashes"].left = this.views["DR2"];
        this.views["DR1_ashes"].right = this.views["DR3"];
        this.views["DR2"].left = this.views["DR4"];
        this.views["DR2"].right = this.views["DR1"];
        this.views["DR3"].left = this.views["DR1"];
        this.views["DR3"].right = this.views["DR4"];
        this.views["DR4"].left = this.views["DR3"];
        this.views["DR4"].right = this.views["DR2"];
        
        this.views["Hallway1"] =
            new View(
                "Hallway1",
                document.getElementById("hallway_door"),
                null,
                [
                    new Clickable(
                        "Door",
                        makeUnitRectSquare(29, 24, 47, 84),
                        "The door to the bedroom",
                    ),

                    new Clickable(
                        "Handle",
                        makeUnitRectSquare(60, 55, 16, 16),
                        "",
                        this.views["Bedroom40"],
                        door_sfx_2,
                    ),
                ],
                [
                    
                ],
                true,
            )

        this.views["Hallway2"] =
            new View(
                "Hallway2",
                document.getElementById("hallway_door"),
                null,
                [
                    new Clickable(
                        "Door",
                        makeUnitRectSquare(29, 24, 47, 84),
                        "The door to the study.",
                    ),

                    new Clickable(
                        "Handle",
                        makeUnitRectSquare(60, 55, 16, 16),
                        "",
                        this.views["Study30"],
                        door_sfx_2,
                    ),
                ],
                [
                    
                ],
                true,
            )

        this.views["Hallway3"] =
            new View(
                "Hallway3",
                document.getElementById("hallway_door"),
                null,
                [
                    new Clickable(
                        "Door",
                        makeUnitRectSquare(29, 24, 47, 84),
                        "The door to the dining room.",
                    ),

                    new Clickable(
                        "Handle",
                        makeUnitRectSquare(60, 55, 16, 16),
                        "",
                        this.views["DR2"], //Dining room
                        door_sfx_2,
                    ),
                ],
                [
                    
                ],
                true,
            )

        this.views["Hallway1"].left = this.views["Hallway2"];
        this.views["Hallway2"].left = this.views["Hallway3"];
        this.views["Hallway3"].left = this.views["Hallway1"];
        this.views["Hallway1"].right = this.views["Hallway3"];
        this.views["Hallway2"].right = this.views["Hallway1"];
        this.views["Hallway3"].right = this.views["Hallway2"];
    },
    
    win : function(){
        this.fadingOut = true;
        MoneyCounter.add(999999, 99);
        document.getElementById("ending").play();
    },
	
    update : function(){
	
	if (! this.started){
	    if (allAssetsLoaded()){
		this.started = true;
                this.firstUpdate();
	    }
	    
	    return;
	}

        MoneyCounter.update(deltaTime);
        Inventory.update(deltaTime);
        Textbox.update(deltaTime);
        
        if (this.fadingOut && this.fadeOutTimeRemaining > 0){ 
            this.fadeOutTimeRemaining = Math.max(0, this.fadeOutTimeRemaining-deltaTime);
        }

        var fadeOutRatio = this.fadeOutTimeRemaining / this.fadeOutTime;
        
        ctx.globalAlpha = fadeOutRatio;
        this.music.volume = fadeOutRatio;

        if (this.fadingOut){
            this.views["Bedroom40_dadbed"].sound.volume = Math.min(.2 * Math.sqrt(fadeOutRatio), 0);
        }
    },
    
    render : function(){
	
	if (! this.started){
	    this.intro();
	    return;
	}
        
        this.renderCurrentView();

        for (i in this.currentView.items){
            this.currentView.items[i].draw(ctx);
        }
        
        //this.drawClickableBounds();
        Textbox.draw(ctx);
        Inventory.draw(ctx);
        MoneyCounter.draw(ctx);
        if (this.currentView.back ) this.backArrow.draw(ctx, mousePos );
        if (this.currentView.left ) this.leftArrow.draw(ctx, mousePos );
        if (this.currentView.right) this.rightArrow.draw(ctx, mousePos);

        //console.log(this.cursorScale[0]);

        if (!Inventory.selectedItem){
            ctx.drawImage(
                this.cursor,
                mousePos[0],
                mousePos[1],
                canvas.width * this.cursorScale[0],
                canvas.height * this.cursorScale[1]
            );
        }
    },
    
    setCurrentView : function(view){
        if (this.currentView.sound){
            this.currentView.sound.pause();
        }
        
        this.currentView = view;
        
        if (this.currentView.sound){
            this.currentView.sound.play();

            if (this.currentView.pauseMusic){
                this.music.pause();
            }
        } else {
            this.music.play();
        }
    },
    
    renderCurrentView : function(){
        if (this.currentView.isSquare){
            this.currentView.render.draw(ctx, [(canvas.width - canvas.height) / 2, 0], [canvas.height, canvas.height]);
        } else {
            this.currentView.render.draw(ctx, [0, 0], [canvas.width, canvas.height]);
        }
    },
    
    drawClickableBounds : function(){
        var i = this.currentView.clickables.length;
        
        while (i--){
            scaleRect(this.currentView.clickables[i].bounds).draw(ctx, 1, "#FF0000");
        }

        scaleRect(this.backArrow.bounds).draw(ctx,  1, "#FF0000");
        scaleRect(this.leftArrow.bounds).draw(ctx,  1, "#FF0000");
        scaleRect(this.rightArrow.bounds).draw(ctx, 1, "#FF0000");
    },

    onClick : function(){
        if (this.backArrow.checkClick(mousePos) && this.currentView.back){
            this.setCurrentView(this.currentView.back);
            return;
        }

        if (this.leftArrow.checkClick(mousePos) && this.currentView.left){
            this.setCurrentView(this.currentView.left);
            return;
        }

        if (this.rightArrow.checkClick(mousePos) && this.currentView.right){
            this.setCurrentView(this.currentView.right);
            return;
        }

        Inventory.checkClick();
        
        var clickable = this.currentView.checkClickables(mousePos);
        
        if (!clickable){
            return;
        }
        
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

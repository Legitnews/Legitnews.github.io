var Textbox = {
    text : "",
    colour : "rgba(137, 137, 211, 0.7)",
    outlineColour : "#000000",
    outlineWidth : 4,
    rect : new Rect([0.6, 0.75], [0.4, 0.25]),
    
    revealedText : "",
	timePerChar : .05,
	timeToChar : 0,
	index : 0,

	textColour : "#000000",
	font : "Snoot",
    fontSize : .046875,

	done : false,
    
    setText : function(text){
        this.revealedText = "";
        this.index = 0;
        
        this.text = text;
    },
    
    update : function(deltaTime){
		this.timeToChar -= deltaTime;

		if (this.timeToChar <= 0){
			if (this.index >= this.text.length){
				this.done = true;
				return;
			}

			this.revealedText += this.text[this.index];
			this.index++;
			this.timeToChar = this.timePerChar;
		}

		if (Key.isDown(Key.ENTER)){
			this.timePerChar = 0.03;
		}
		else{
			this.timePerChar = 0.05;
		}
	},

	draw : function(ctx){
        var scaleRect = this.rect.copy().scale(SCREEN_DIM);
        var scaleFontSize = Math.round(SCREEN_DIM * this.fontSize);
        var font = scaleFontSize + "px " + this.font;
        var textSize = scaleFontSize * (2/3);
        
		scaleRect.draw(ctx, undefined, this.colour);
        scaleRect.draw(ctx, this.outlineWidth, this.outlineColour);

		ctx.fillStyle = this.textColour;
		ctx.font = font;

		wrapText(ctx, this.revealedText, scaleRect.pos.x + this.outlineWidth / 2, scaleRect.pos.y + this.outlineWidth / 2 + textSize, scaleRect.size.x - this.outlineWidth/2, textSize);
	},
};
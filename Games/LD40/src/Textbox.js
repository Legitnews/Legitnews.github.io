var Textbox = {
    text : "",
    colour : "rgba(137, 137, 211, 0.5)",
    outlineColour : "#000000",
    outlineWidth : 4,
    rect : new Rect([0.6, 0], [0.4, 0.3]),
    
    revealedText : "",
    timePerChar : .03,
    timeToChar : 0,
    index : 0,

    textColour : "#000000",
    font : "Snoot",
    fontSize : 16,

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
	    this.timePerChar = 0.01;
	}
	else{
	    this.timePerChar = 0.03;
	}
    },

    draw : function(ctx){
        var scaled_rect = scaleRect(this.rect);
        var font = this.fontSize + "px " + this.font;
        var textSize = this.fontSize;
        
	scaled_rect.draw(ctx, undefined, this.colour);
        scaled_rect.draw(ctx, this.outlineWidth, this.outlineColour);

	ctx.fillStyle = this.textColour;
	ctx.font = font;

	wrapText(ctx, this.revealedText, scaled_rect.pos.x + this.outlineWidth / 2, scaled_rect.pos.y + this.outlineWidth / 2 + textSize, scaled_rect.size.x - this.outlineWidth/2, textSize);
	},
};

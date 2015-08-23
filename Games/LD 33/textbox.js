function TextBox(text, speaker, clip){
	Rect.call(this, [50, 20], [500 - (clip ? 80 : 0), 100], "rgba(0, 0, 255, .5)");
	this.text = text;
	this.speaker = speaker;

	this.revealedText = "";
	this.timePerChar = .05;
	this.timeToChar = 0;
	this.index = 0;

	this.textColour = "#000000"
	this.font = "24px Snoot";
	this.textSize = 18;

	this.outlineWidth = 10;
	this.outlineColour = "rgba(0, 0, 0, .8)"

	this.done = false;

	this.update = function(deltaTime){
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
	}

	this.draw = function(ctx){
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);

		ctx.lineWidth = this.outlineWidth;
		ctx.strokeStyle = this.outlineColour;
		ctx.strokeRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);

		ctx.fillStyle = this.textColour;
		ctx.font = this.font;



		wrapText(ctx, (speaker ? this.speaker + ":\n" : "") + this.revealedText, this.pos.x + this.outlineWidth / 2, this.pos.y + this.outlineWidth / 2 + this.textSize, this.size.x - this.outlineWidth/2, this.textSize);
	};
}

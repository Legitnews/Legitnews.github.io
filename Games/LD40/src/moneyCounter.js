"use strict";

function leftPad(str, pad, len){
    // Should have just used the NPM library
    
    while (str.length < len){
        str  = pad + str;
    }

    return str;
}

var MoneyCounter = {
    text : "",
    colour : "#40C030",
    pos : new Vector2(1.0, 0.29),
    
    currentMoney : 0,
    desiredMoney : 0,
    defaultAddSpeed : 1,
    addSpeed : 1,

    font : "Snoot",
    fontSize : 32,

    done : false,
    
    add : function(amt, speed){
        this.desiredMoney += amt;
        this.addSpeed = speed ? speed : this.defaultAddSpeed;
    },
    
    update : function(deltaTime){
	if (this.desiredMoney > this.currentMoney){
            this.currentMoney += this.addSpeed;
        }

        this.currentMoney = Math.min(this.desiredMoney, this.currentMoney);
    },

    draw : function(ctx){
        var scaled_pos = this.pos.copy();
        scaled_pos.x *= canvas.width;
        scaled_pos.y *= canvas.height;
        var font = this.fontSize + "px " + this.font;

	ctx.fillStyle = this.colour;
	ctx.font = font;
        var text = ("£"+leftPad(""+this.currentMoney, "0", 5));
        // The substr is a hack because JS string handling is weird with the £ symbol
        
        scaled_pos.x -= ctx.measureText(text).width;

	ctx.fillText(text, scaled_pos.x, scaled_pos.y);
    },
};

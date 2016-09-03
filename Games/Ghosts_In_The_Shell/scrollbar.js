"use strict";

var ScrollBar = {
    
    origin : [0, 0],
    maxHeight : 0,
    
    pos : [0, 0],
    size  : [0, 0],
    
    colour : "#B0B0B0",
    
    setup : function(pos, size, viewHeightChars, docLength, viewOffset, maxViewOffset){
          
        this.origin = pos;
        this.maxHeight = size[1];
        
        this.size[0] = size[0];
        this.size[1] = this.calcHeight(viewHeightChars, docLength);
        this.pos[0] = this.origin[0];
        this.pos[1] = this.calcPos(viewOffset, maxViewOffset);
    },
    
    updatePos : function(viewOffset, maxViewOffset){
        this.pos[1] = this.calcPos(viewOffset, maxViewOffset);
    },
    
    calcHeight : function (viewHeightChars, docLength) {
        var ratio = viewHeightChars / docLength;
        
        if (ratio > 1) ratio = 1;
        
        return this.maxHeight * ratio;
    },
    
    calcPos : function(viewOffset, maxViewOffset){
        var diff = this.maxHeight - (this.origin[1] + this.size[1]);
        var ratio = viewOffset / maxViewOffset;
        
        if (ratio > 1) ratio = 1;
        
        return this.origin[1] + (diff * ratio);
    },
    
    draw : function(ctx){
        ctx.fillStyle = this.colour;
        ctx.beginPath();
        ctx.rect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
        ctx.fill();
    },
};
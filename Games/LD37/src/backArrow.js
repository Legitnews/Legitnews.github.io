var BackArrow = {
    imageLow : document.getElementById("arrow_low"),
    imageHigh : document.getElementById("arrow_high"),
    bounds : new Rect([0.43, 0.86], [0.12, 0.08]),
    
    draw : function(ctx, mousePos, screendim){
        var scaledBounds = this.bounds.copy().scale(screendim);
        
        if (scaledBounds.collidePoint(mousePos)){
            ctx.drawImage(this.imageHigh, 0, 0, screendim, screendim);
        }
        else{
            ctx.drawImage(this.imageLow, 0, 0, screendim, screendim);
        }
    },
    
    checkClick : function(mousePos, screendim){
        return this.bounds.copy().scale(screendim).collidePoint(mousePos);
    }
};
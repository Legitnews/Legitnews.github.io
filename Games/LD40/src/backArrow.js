function Arrow(imageLow, imageHigh, bounds){
    this.imageLow = imageLow;
    this.imageHigh = imageHigh;

    this.bounds = bounds;
    
    this.draw = function(ctx, mousePos){
        var scaledBounds = scaleRect(this.bounds)
        
        if (scaledBounds.collidePoint(mousePos)){
            ctx.drawImage(this.imageHigh, 0, 0, canvas.width, canvas.height);
        }
        else{
            ctx.drawImage(this.imageLow, 0, 0, canvas.width, canvas.height);
        }
    };
    
    this.checkClick = function(mousePos){
        return scaleRect(this.bounds).collidePoint(mousePos);
    }
};

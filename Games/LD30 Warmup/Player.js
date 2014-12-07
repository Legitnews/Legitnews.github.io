function Player(){
	this.animation = new Animation([rick0, rick1, rick2, rick3, rick4, rick5], 10, false);
	
	this.pos = new Vector2(0, 0);
	
	this.update = function(deltaTime){
	}
	
	this.draw = function(ctx){
		this.animation.draw(ctx, this.pos);
	}
}

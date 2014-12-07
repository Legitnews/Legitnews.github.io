var g = new Vector2(0, 98.1);

var rockImages = [
				  document.getElementById("rock1"),
				 ];

function randomChoice(list){
	return list[Math.floor(Math.random() * list.length)];
}

function Rock(pos){
	this.pos = pos ? new Vector2(pos[0], pos[1]) : new Vector2(Math.random() * canvas.width / 2, Math.random() * canvas.height / 2); 
	this.rotation = 0;
	this.velocity = ZERO.copy();
	
	this.image = randomChoice(rockImages);
	this.gotImageData = false;
	this.circle = new Circle(this.pos, this.image.width / 2);
	
	this.draw = function(){
		drawRotatedImage(this.image, this.pos, this.rotation);
		
		this.circle.draw(ctx, true, "#FF0000");
	}
	
	this.getImageData = function(){
		this.imageData = getImageData(this.image);
	}
	
	this.update = function(){
		if (! this.gotImageData){
			this.getImageData();
			this.gotImageData = false;
		}
		
		var dV = g.copy();
		dV.mul(deltaTime);
		this.velocity.add(dV);
		
		var dP = this.velocity.copy();
		dP.mul(deltaTime);
		this.pos.add(dP);
		
		this.circle.centre.add(dP);
	}
}

function makeRect(imageData){
	var y = 0;
	
	for(var i=imageData.data.length; i > 0; i -= 4){
		if (imageData.data[i] != 0){
			y = Math.floor(i  / (imageData.width * 4));
		}
	}
	
	return new Rect([0, y], [canvas.width, canvas.height - y]);
}

function Hills(){
	this.image = document.getElementById("hills");
	window.setTimeout(this.makeRect, 100);
	
	this.makeRect = function(){
		this.imageData = getImageData(this.image);
		this.rect = makeRect(this.imageData);
	};
	
	this.draw = function(){
		ctx.drawImage(this.image, 0, 0);
		this.rect.draw(ctx, true);
	};
}

var rocks = [new Rock(), new Rock()];
var hills = new Hills();

function update(){
	updateDeltaTime();
	
	for (i in rocks){
		rocks[i].update()
	}
	
}

function render(){	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	hills.draw();
	
	for (i in rocks){
		rocks[i].draw()
	}
}

var renderIntervalID = window.setInterval(render, 1000 / FPS);
var updateIntervalID = window.setInterval(update, 5);

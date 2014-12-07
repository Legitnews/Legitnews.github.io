function getImageData(image){
	var canvas = document.createElement("canvas");
	
	canvas.width = image.width;
	canvas.height = image.height;
	
	canvas.getContext("2d").drawImage(image, 0, 0);
	
	return canvas.getImageData(0, 0, canvas.width, canvas.height);
}

function makeTweenedFrames(image1, image2, numFrames){
	
	if (image1.width !== image2.width || image1.height !== image2.height){
		throw "Images must be the same size.";
	}
	
	var t = 1 / numFrames;
	
	var imageData1 = getImageData(image1);
	var imageData2 = getImageData(image2);
	
	var r, g, b, a;
	
	var frames = [];
	
	var canvas;
	var canvasImageData;
	
	for (var i=0; i < numFrames; i++){
		canvas = document.createElement("canvas");
		canvasImageData = canvas.getImageData(0, 0, canvas.width, canvas.height);
		
		canvas.width = image1.width;
		canvas.height = image1.height;
		
		for (var x=0; x < image1.width; x++){
			for(var y=0; y < image1.height; y++){
				
				r = (x * image.width + y) * 4;
				g = r + 1;
				b = g + 1;
				a = b + 1;
				
				if (imageData1[r] !== imageData2[r]){
					canvasImageData[r] = imageData1[r] + imageData2[r] * t * i;
				}
				if (imageData1[g] !== imageData2[g]){
					canvasImageData[g] = imageData1[g] + imageData2[g] * t * i;
				}
				if (imageData1[b] !== imageData2[b]){
					canvasImageData[b] = imageData1[b] + imageData2[b] * t * i;
				}
				if (imageData1[a] !== imageData2[a]){
					canvasImageData[a] = imageData1[a] + imageData2[a] * t * i;
				}
			}
		}
		
		canvas.getContext("2d").putImageData(canvasImageData, 0, 0);
		
		frames.push(canvas);
	}
}

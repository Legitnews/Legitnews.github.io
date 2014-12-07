function main(){
	var r = 0;
	var g = 0;
	var b = 0
	
	alert(canvas.width);
	
	for (var i=0; i < canvas.width; i++){
		for (var j=0; j < canvas.height; j++){
			
			if (r < 255){
				r++;
			}
			else if (g < 255){
				g++;
			}
			else if (b < 255){
				b++;
			}
			
			ctx.fillStyle = "rgba("+r+","+g+","+b+")";
			ctx.fillRect(i, j, 1, 1);
		}
	}
	
	alert("end");
}

setTimeout(main, 100);

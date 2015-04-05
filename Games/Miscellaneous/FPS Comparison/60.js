var FPS = 60;
var canvas = document.getElementById("canvas60");

var anim60 = new Anim(FPS, canvas);

window.setInterval(function(){ anim60.update(); }, 1000 / FPS);
var FPS = 144;
var canvas = document.getElementById("canvas144");

var anim144 = new Anim(FPS, canvas);

window.setInterval(function(){ anim144.update(); }, 1000 / FPS);
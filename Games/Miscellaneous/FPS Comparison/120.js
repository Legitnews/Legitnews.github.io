var FPS = 120;
var canvas = document.getElementById("canvas120");

var anim120 = new Anim(FPS, canvas);

window.setInterval(function(){ anim120.update(); }, 1000 / FPS);
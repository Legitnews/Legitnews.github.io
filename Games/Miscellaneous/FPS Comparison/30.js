var FPS = 30;
var canvas = document.getElementById("canvas30");

var anim30 = new Anim(FPS, canvas);

window.setInterval(function(){ anim30.update(); }, 1000 / FPS);
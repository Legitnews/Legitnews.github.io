"use strict";

var d = new Date();
var startTime = d.getTime() / 1000;
var time;
var deltaTime;
var lastTime = startTime;
var timeElapsed;

function loadFile(id){
    var elem = document.getElementById(id);
    
    return elem.contentDocument.documentElement.childNodes[1].childNodes[0].innerText;
}

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
}

function doGetCaretPosition (oField) {
  //http://stackoverflow.com/users/43677/bezmax

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return iCaretPos;
}

function updateDeltaTime(){
	d = new Date();
	time = d.getTime() / 1000;
	deltaTime = time - lastTime;
	timeElapsed = time - startTime;
	lastTime = time;
}


window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame    ||
          	function( callback ){
          		window.setTimeout(callback, 1000 / FPS);
          	};
})();

var Key = {
	_pressed: {},

	TAB : 9,

	ENTER : 13,
	ALT : 18,
    
    ESC : 27,

	LEFT  : 37,
	UP    : 38,
	RIGHT : 39,
	DOWN  : 40,

	W : 87,
	A : 65,
	S : 83,
	D : 68,

	H : 72,
	J : 74,
	K : 75,
	L : 76,

	SPACE : 32,

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	},
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
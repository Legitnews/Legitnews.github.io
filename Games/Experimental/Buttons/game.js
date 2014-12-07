"use strict";

var text = document.getElementById("text");

function printKeyPress(event){
	if (text.value !== ""){
		text.value += " ";
	}
	text.value += event.keyCode;
	
	event.preventDefault();
	
}

window.addEventListener('keydown', printKeyPress, false);

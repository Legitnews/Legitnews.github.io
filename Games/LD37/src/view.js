"use strict";

function View(name, render, sound, clickables, back) {
    this.render = (render instanceof Animation) ? render : new Animation([render], 0, false);
    
    this.sound = sound;
    this.clickables = clickables !== undefined ? clickables : [];
    
    this.back = back;
    
    this.checkClickables = function(mousePos){
        var i=this.clickables.length;
        while (i--){
            if (this.clickables[i].checkClick(mousePos)) return this.clickables[i];
        }
        
        return null;
    }
}

function Clickable(name, bounds, text, newView, sound, onClick){
    this.name = name;
    this.bounds = bounds; //Unit space rect
    this.text = text;
    this.newView = newView;
    this.sound = sound;
    this.onClick = onClick;
    this.timesClicked = 0;
    
    this.checkClick = function(mousePos){
        return this.bounds.copy().scale(SCREEN_DIM).collidePoint(mousePos);
    }
    
    this.activate = function(){
        this.timesClicked++;
        if (this.sound){
            this.sound.currentTime = 0;
            this.sound.play();
        }
        if (this.onClick) this.onClick();
    }
}
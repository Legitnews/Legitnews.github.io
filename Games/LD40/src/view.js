"use strict";

function View(name, render, sound, clickables, items, isSquare, pauseMusic) {
    this.render = (render instanceof Animation) ? render : new Animation([render], 0, false);
    
    this.sound = sound;
    this.items = items !== undefined ? items : [];
    this.clickables = (clickables !== undefined ? clickables : []).concat(this.items);

    this.pauseMusic = pauseMusic;

    this.left  = null;
    this.right = null;
    this.back  = null;

    this.isSquare = isSquare;
    
    this.checkClickables = function(mousePos){
        var i=this.clickables.length;
        while (i--){
            if (this.clickables[i].checkClick(mousePos)) return this.clickables[i];
        }
        
        return null;
    }

    this.remItem = function(item){
        this.items.splice(this.items.indexOf(item), 1);
        this.clickables.splice(this.clickables.indexOf(item), 1);
    }
}

function Clickable(name, bounds, text, newView, sound, onClick, reqItem, reqItemText, reqItemNewView, reqItemOnClick){
    this.name = name;
    this.bounds = bounds; //Unit space rect
    this.text = text;
    this.newView = newView;
    this.sound = sound;
    this.onClick = onClick;
    this.timesClicked = 0;

    this.reqItem = reqItem;
    this.reqItemText = reqItemText ? reqItemText : this.text;
    this.reqItemNewView = reqItemNewView ? reqItemNewView : this.newView;
    this.reqItemOnClick = reqItemOnClick ? reqItemOnClick : this.onClick;
    
    this.checkClick = function(mousePos){
        return scaleRect(this.bounds).collidePoint(mousePos);
    }
    
    this.activate = function(){
        this.timesClicked++;
        if (this.sound){
            this.sound.currentTime = 0;
            this.sound.play();
        }
        if (this.reqItem && Inventory.selectedItem == this.reqItem){
            if (this.reqItemText) Textbox.setText(this.reqItemText);
            if (this.reqItemNewView) Game.setCurrentView(this.reqItemNewView);
            if (this.reqItemOnClick) this.reqItemOnClick();
            Inventory.deselectItem(true);
        }
        else{
            if (this.text) Textbox.setText(this.text);
            if (this.newView) Game.setCurrentView(this.newView);
            if (this.onClick) this.onClick();
        }
    }
}

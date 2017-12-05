"use strict";

var Inventory = {
    colour : "rgba(137, 137, 211, 0.5)",
    outlineColour : "#000000",
    outlineWidth : 4,
    rect : new Rect([0, 0], [0.6, 0.3]),

    itemSize : new Rect([0, 0], [.1, .15]),

    textColour : "#000000",
    font : "Snoot",
    fontSize : 24,

    items : [],

    selectedItem : null,
    selectedItemIndex : -1,
    
    update : function(deltaTime){
	if (this.selectedItem){
            this.selectedItem.bounds.pos = new Vector2(mousePos[0] / canvas.width, mousePos[1] / canvas.height);
        }
    },

    draw : function(ctx){
        var scaled_rect = scaleRect(this.rect);
        //var scaledItemSize = scaleRect(this.itemSize);
        //var font = this.fontSize + "px " + this.font;
        //var textSize = this.fontSize * (2/3);

        var remHeight = this.rect.size.y;
        var remWidth  = this.rect.size.x;

        ctx.beginPath();
        ctx.strokeStyle = this.outlineColour;

        scaled_rect.draw(ctx, undefined, this.colour);
        
        for (; remWidth > 0; remWidth -= this.itemSize.size.x){
            ctx.moveTo(remWidth * canvas.width, scaled_rect.pos.y);
            ctx.lineTo(remWidth * canvas.width, scaled_rect.pos.y + scaled_rect.size.y);
        }

        for (; remHeight > 0; remHeight -= this.itemSize.size.y){
            ctx.moveTo(scaled_rect.pos.x, remHeight * canvas.height);
            ctx.lineTo(scaled_rect.pos.x + scaled_rect.size.x, remHeight * canvas.height);
        }

        ctx.stroke();

        for (i in this.items){
            this.items[i].draw(ctx);
        }
        
        //scaled_rect.draw(ctx, this.outlineWidth, this.outlineColour);

	//ctx.fillStyle = this.textColour;
	//ctx.font = font;

	
    },

    add : function(item){
        var i = this.items.length;
        item.bounds.pos = new Vector2(
            this.rect.pos.x + ((i * this.itemSize.size.x) % this.rect.size.x),
            this.rect.pos.y + (this.itemSize.size.y * Math.floor((i * this.itemSize.size.x) / this.rect.size.x)),
        );

        item.onClick = null;
        item.inWorld = false;

        item.bounds.size = this.itemSize.size;
        this.items.push(item);
    },

    deselectItem : function(used){
        var i = this.selectedItemIndex;
        this.selectedItem.bounds.pos = new Vector2(
            this.rect.pos.x + ((i * this.itemSize.size.x) % this.rect.size.x),
            this.rect.pos.y + (this.itemSize.size.y * Math.floor((i * this.itemSize.size.x) / this.rect.size.x)),
        );

        if(used && this.selectedItem.destory_on_use){
            //Maybe implement this?
        }
        
        this.selectedItem = null;
    },

    checkClick : function(){
        if (! scaleRect(this.rect).collidePoint(mousePos)){
            return;
        }
        
        if (this.selectedItem){
            this.deselectItem();
        } else {
            for (i in this.items){
                if (scaleRect(this.items[i].bounds).collidePoint(mousePos)){
                    this.selectedItem = this.items[i];
                    this.selectedItemIndex = i;
                }
            }
        }
    }
};

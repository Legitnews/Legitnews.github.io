function Item(name,  bounds, render, text, sound, pickup, money_val, destory_on_use, onCollect, invis, reqItem, reqItemText){

    this.onCollect = onCollect;
    
    Clickable.call(this, name, bounds, text, null, null,
                   function(){
                       this.onClick();
                   },
                   reqItem = reqItem,
                   reqItemText = reqItemText,
                  )

    this.render = (render instanceof Animation) ? render : new Animation([render], 0, false);
    this.pickup = pickup;
    this.money_val = money_val ? money_val : 0;
    this.destory_on_use = destory_on_use;
    this.inWorld = true;
    this.invis = invis;
    this.reqItem = reqItem;
    this.sound = sound;

    this.draw = function(ctx){
        if (this.invis && this.inWorld) return;
        this.render.draw(ctx, scaleRect(this.bounds).pos, [canvas.width * this.bounds.size.x, canvas.height * this.bounds.size.y]);
    }

    this.onClick = function(){
        if (this.reqItem && Inventory.selectedItem !== this.reqItem) return;
        
        MoneyCounter.add(this.money_val);
        Game.currentView.remItem(this);

        if (this.sound){
            this.sound.play();
        }

        if (this.onCollect){
            this.onCollect();
        }
        
        if (this.pickup){
            Inventory.add(this);
        }
    } 
}
init3D(canvas, ctx);

var cuboid = new Cuboid(new Vector3(0, 0, 0), new Vector3(50, 50, 50));

var centre;
var oldCentre = new Vector2(canvas.width / 2, canvas.height / 2);

function update(){
    updateDeltaTime();
    
    if (Key.isDown(Key.UP)){
        cuboid.rotate(Math.PI / 4 * deltaTime, 0);
    }
    
    if (Key.isDown(Key.DOWN)){
        cuboid.rotate(Math.PI / 4 * -deltaTime, 0);
    }
    
    if (Key.isDown(Key.LEFT)){
        cuboid.rotate(Math.PI / 4 * -deltaTime, 1);
    }
    
    if (Key.isDown(Key.RIGHT)){
        cuboid.rotate(Math.PI / 4 * deltaTime, 2);
    }
    
    if (Key.isDown(Key.W)){
        cuboid.scale(1 + .1 * deltaTime, new Vector3(300, 300, 0));
    }
    
    else if (Key.isDown(Key.S)){
        cuboid.scale(1 - .1 * deltaTime, new Vector3(300, 300, 0));
    }
    
    if (Key.isDown(Key.A)){
        cuboid.translate(new Vector3(0, 0, 200 * deltaTime));
    }
    
    else if (Key.isDown(Key.D)){
        cuboid.translate(new Vector3(0, 0, -200 * deltaTime));
    }
    
    if (Key.isDown(Key.ENTER)){
        if (Camera.mode == "perspective"){
            Camera.mode = "orthographic";
        }
        else{
            Camera.mode = "perspective";
        }
    }
}

function render(){    
    Camera.render(ctx);
    
    ctx.fillText(Math.ceil(1 / deltaTime), -200, -200);
}

window.setInterval(update, 5);
window.setInterval(render, 1000 / FPS);

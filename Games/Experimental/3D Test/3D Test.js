init3D(canvas, ctx);

//var cuboid = new SquareBasePyramid(new Vector3(0, 0, 0), 3, 4);
//var cuboid = new Cuboid(new Vector3(0, 0, 0), new Vector3(2, 2, 2));

var centre;
var oldCentre = new Vector2(canvas.width / 2, canvas.height / 2);

var FOVslider = document.getElementById("fov");
FOVslider.value = Camera.FOV * (FOVslider.max / (2*Math.PI));

var stereoCheckbox = document.getElementById("stereo");
stereoCheckbox.value = Camera.checked;

var xmlhttp;
xmlhttp=new XMLHttpRequest();
xmlhttp.open('GET', "hand.obj", false);
xmlhttp.send();

var model = xmlhttp.responseText;

var cuboid = loadModel(model);

var models = {
  "Cube" : new Cuboid(new Vector3(0, 0, 0), new Vector3(3, 3, 3)),
  "Pyramid" : new SquareBasePyramid(new Vector3(0, 2, 0), 3, 4),
  "Hand" : loadModel(model),
}
Camera.objects = [];

var modelRadioButtons = document.getElementsByName("model");

function showModel(name){
  cuboid = models[name];
  Camera.objects = [cuboid];

  currModel = name;
}

var currModel = "Cube";
showModel(currModel);

for (i in modelRadioButtons){
  if (modelRadioButtons[i].value === currModel){
    modelRadioButtons[i].checked = true;
  }
}

function updateModel(){
  for (i in modelRadioButtons){
    if (modelRadioButtons[i].checked){
      showModel(modelRadioButtons[i].value);
    }
  }
}

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
        cuboid.scale(1 + .2 * deltaTime);
    }

    else if (Key.isDown(Key.S)){
        cuboid.scale(1 - .2 * deltaTime);
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

    Camera.FOV  = FOVslider.value * ((2*Math.PI) / FOVslider.max);
    Camera.stereoscopic = stereoCheckbox.checked;
}

function render(){
    Camera.render(ctx);

    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(Math.ceil(1 / deltaTime), canvas.width / 2 * -1, canvas.width / 2 * -1 + 32);
}

window.setInterval(update, 5);
window.setInterval(render, 1000 / FPS);

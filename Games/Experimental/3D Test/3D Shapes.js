
var SQRT2 = 1.4142135623730950488

var SCREENSIZE;
function init3D(canvas, ctx){
    ctx.translate(canvas.width / 2, canvas.height / 2);

    SCREENSIZE = new Vector2(canvas.width, canvas.height);
    Camera.orthographicMatrix = Camera.calcProjectionMatrix(SCREENSIZE.x, SCREENSIZE.y);
}

function vert01toScreen(vert){
  var screenvert = [];

  screenvert[0] = vert[0] * SCREENSIZE.x - (SCREENSIZE.x / 2);
  screenvert[1] = vert[1] * SCREENSIZE.y - (SCREENSIZE.y / 2);

  return screenvert;
}

var Camera = {
    pos : new Vector3(0, 0, -10),
    rotation : new Vector3(0, 0, 0), //Radians

    nearClipping : 0,
    farClipping : 1000,
    layerMask : null,

    stereoscopic : false,
    steroDisp : new Vector3(1, 0, 0), //Displacement between the two eyes
    stereoColours : ["rgb(255, 0, 0)", "rgba(0, 255, 255, .5)"], //Red and Cyan

    //add for left eye, sub for right eye

    FOV : 2 * Math.PI / 3,

    mode : "perspective",

    objects : [],

    render : function(ctx){

        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        for (var i=0; i < this.objects.length; i++){
            var obj = this.objects[i];

            if (!this.stereoscopic){
              obj.draw(ctx, this);
            }
            else{
              this.pos.add(this.steroDisp.copy().div(2));
              obj.draw(ctx, this, this.stereoColours[0]);

              this.pos.sub(this.steroDisp);
              obj.draw(ctx, this, this.stereoColours[1]);

              this.pos.add(this.steroDisp.copy().div(2));
            }
        }
    },

    calcProjectionMatrix : function(width, height){
        return new Matrix([2 / width, 0, 0, 0],
                          [0, 2 / height, 0, 0],
                          [0, 0, -2 / (this.farClipping - this.nearClipping), -((this.farClipping + this.nearClipping) / (this.farClipping - this.nearClipping))],
                          [0, 0, 0, 1]);
    },

    projectNodes : function(nodes){
        var projected = [];
        var node;

        for (var i=0; i < nodes.length; i++){
            node = nodes[i].copy();

            if (this.mode === "perspective"){
                projected.push(this.perspectiveProject(node));
            }

            else if (this.mode === "orthographic"){
                var m = node.copy().mul(this.orthographicMatrix);

                projected.push(new Vector2(m.x * (SCREENSIZE.x / 2), m.y * (SCREENSIZE.y / 2)));
            }
        }

        return projected;
    },

    perspectiveProject : function(node){
        var relative = node.copy().sub(this.pos);

        if ((relative.z) < this.nearClipping || (relative.z) > this.farClipping){
            return null;
        }

        var e = new Vector3(0, 0, -(1 / Math.tan(this.FOV / 2)) * SCREENSIZE.x * 2);
        var d = new Vector3(0, 0, 0);

        var x = (node.x - this.pos.x);
        var y = (node.y - this.pos.y);
        var z = (node.z - this.pos.z);

        var x_sin = Math.sin(this.rotation.x);
        var y_sin = Math.sin(this.rotation.y);
        var z_sin = Math.sin(this.rotation.z);

        var x_cos = Math.cos(this.rotation.x);
        var y_cos = Math.cos(this.rotation.y);
        var z_cos = Math.cos(this.rotation.z);

        d.x = y_cos * (z_sin * y + z_cos * x) - y_sin * z;
        d.y = x_sin * (y_cos * z + y_sin * (z_sin * y + z_cos * x)) + x_cos * (z_cos * y - z_sin * x);
        d.z = x_cos * (y_cos * z + y_sin * (z_sin * y + z_cos * x)) - x_sin * (z_cos * y - z_sin * x);

        return new Vector2((e.z / d.z) * d.x - e.x, (e.z / d.z) * d.y - e.y);
    }
}

function Shape(nodes, faces, colour, faceColour, layer){
    Camera.objects.push(this);

    this.nodes = nodes;
    this.faces = faces;
    this.edges = [];

    this.colour = colour ? colour : "#00FF00";
    this.faceColour = faceColour ? faceColour : "#008000"
    this.layer = layer ? layer : 1;

    this.drawFaces = true;
    this.drawEdges = true;
    this.drawNodes = false;
    this.drawNodeNumbers = false;

    this.projectedNodes = Camera.projectNodes(this.nodes);

    this.updateNodes = function(){
      this.projectedNodes = Camera.projectNodes(this.nodes);
    }

    this.calcEdges = function(){
      edges = [];
      var edge;
      var skip;

      for (i in this.faces){
        for (var j = 0; j < this.faces[i].length; j++){
          edge = [this.faces[i][j], this.faces[i][j == this.faces[i].length-1 ? 0 : j+1]];

          if (edge[0] === undefined || edge[1] === undefined){
            continue;
          }

          skip = false;

          for (k in edges){
            if ((edges[k][0] === edge[0] && edges[k][1] === edge[1]) || ((edges[k][1] === edge[0] && edges[k][0] === edge[1]))){
              skip = true;
              break;
            }
          }

          if (skip){
            continue;
          }

          edges.push(edge);
        }
      }

      return edges;
    }

    this.edges = this.calcEdges();

    this.centre = function(){
        var total_x = 0;
        var total_y = 0;
        var total_z = 0;

        for (i in this.nodes){
            total_x += this.nodes[i].x;
            total_y += this.nodes[i].y;
            total_z += this.nodes[i].z;
        }

        return new Vector3(total_x / this.nodes.length, total_y / this.nodes.length, total_z / this.nodes.length);
    }

    this.translate = function(vector){
        for (i in this.nodes){
            this.nodes[i].add(vector);
        }

        this.updateNodes();
    }

    this.scale = function(scale, centre){
        centre = centre ? centre : this.centre();

        for (i in this.nodes){
            this.nodes[i].x = centre.x + scale * (this.nodes[i].x - centre.x);
            this.nodes[i].y = centre.y + scale * (this.nodes[i].y - centre.y);
            this.nodes[i].z = centre.z + scale * (this.nodes[i].z - centre.z);
        }

        this.updateNodes();
    }

    this.rotate = function(theta, axis){
        var sin_t = Math.sin(theta);
        var cos_t = Math.cos(theta);

        var j = (axis + 1) % 3;
        var k = (axis + 2) % 3;

        for (var n=0; n<this.nodes.length; n++) {
            var node = this.nodes[n];
            var y = node[j];
            var z = node[k];
            node[j] = y * cos_t - z * sin_t;
            node[k] = z * cos_t + y * sin_t;
        }

        this.updateNodes();
    }

    this.matrixTransform = function(matrix){
        for (i in this.nodes){
            this.nodes[i].mul(matrix);
        }

        this.updateNodes();
    }

    this.draw = function(ctx, camera, colour){
        var start;
        var point;
        var end;

        ctx.fillStyle = colour ? colour : this.faceColour;

        if (this.drawFaces){
            for (i in this.faces){
                start = this.projectedNodes[this.faces[i][0]];

                if (! start){
                    continue;
                }

                //console.log("hi");

                ctx.beginPath();
                ctx.moveTo(start.x, start.y);

                for (j in this.faces[i]){
                  point = this.projectedNodes[this.faces[i][j]];

                  if (! point){
                    continue;
                  }

                  ctx.lineTo(point.x, point.y);
                }
                ctx.fill();
            }
        }

        ctx.strokeStyle = colour ? colour : this.colour;
        ctx.fillStyle = colour ? colour : this.colour;

        if (this.drawEdges){
          ctx.beginPath();

            for (i in this.edges){
                start = this.projectedNodes[this.edges[i][0]];
                end   = this.projectedNodes[this.edges[i][1]];

                if (! start || ! end){
                    continue;
                }

                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
            }

            ctx.stroke();
        }

        if (this.drawNodes){

            for (i in this.projectedNodes){
                if (! this.projectedNodes[i]){
                    continue;
                }

                if (this.drawNodeNumbers){
                  ctx.fillText(i, this.projectedNodes[i].x, this.projectedNodes[i].y);
                }

                ctx.beginPath();
                ctx.arc(this.projectedNodes[i].x, this.projectedNodes[i].y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function loadModel(model){
  verts = [];
  faces = [];

  lines = model.split("\n");

  for (i in lines){
    tokens = lines[i].split(" ");
    args = tokens.slice(1);

    if (tokens[0] == "v"){
      var vec = [];

      for (j in args){

        if (! args[j]){
          continue;
        }

        vec.push(parseFloat(args[j]));
      }

      verts.push(new Vector3(vec[0], vec[1], vec[2]));
    }


    else if (tokens[0] == "f"){
      var face = [];

      for (j in args){

        if (! args[j]){
          continue;
        }

        face.push(parseFloat(args[j].split("/")[0])-1);
      }

      faces.push(face);
    }
  }

  return new Shape(verts, faces);
}

function Cuboid(centre, size){
    this.size = size;

    var faces = [
      [0, 1, 6, 3],
      [0, 2, 4, 1],
      [0, 2, 5, 3],
      [1, 4, 7, 6],
      [2, 4, 7, 5],
      [3, 5, 7, 6],
    ];

    this.calcNodes = function(centre){
      centre = centre ? centre : this.centre();

      var nodes = [];
      nodes.push(centre.copy().sub(this.size).div(2));
      nodes.push(centre.copy().add([this.size[0] / 2, -this.size[1] / 2, -this.size[2] / 2]));
      nodes.push(centre.copy().add([-this.size[0] / 2, this.size[1] / 2, -this.size[2] / 2]));
      nodes.push(centre.copy().add([-this.size[0] / 2, -this.size[1] / 2, this.size[2] / 2]));
      nodes.push(centre.copy().add([this.size[0] / 2, this.size[1] / 2, -this.size[2] / 2]));
      nodes.push(centre.copy().add([-this.size[0] / 2, this.size[1] / 2, this.size[2] / 2]));
      nodes.push(centre.copy().add([this.size[0] / 2, -this.size[1] / 2, this.size[2] / 2]));
      nodes.push(centre.copy().add(this.size).div(2));

      return nodes;
    }

    Shape.call(this, this.calcNodes(centre), faces);

    this.setSize = function(size){
      this.size = size;

      this.nodes = this.calcNodes();
    }
}

function SquareBasePyramid(tip, base, height){
  this.tip = tip;
  this.base = base;
  this.height = height;

  var faces = [[1, 2, 4, 3],
               [0, 1, 2],
               [0, 1, 3],
               [0, 2, 4],
               [0, 3, 4]];

  this.calcNodes = function(tip){
    tip = tip ? tip : this.tip;

    var diag = (base / SQRT2)

    var nodes = [];
    nodes.push(tip.copy());
    nodes.push(tip.copy().add([diag, -height, diag]));
    nodes.push(tip.copy().add([-diag, -height, diag]));
    nodes.push(tip.copy().add([diag, -height, -diag]));
    nodes.push(tip.copy().add([-diag, -height, -diag]));

    return nodes;
  }

  Shape.call(this, this.calcNodes(tip), faces);


}

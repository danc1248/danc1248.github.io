function maze(x,y) {
  var n=x*y-1;
  if (n<0) {alert("illegal maze dimensions");return;}
  var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
      verti =[]; for (var j= 0; j<y+1; j++) verti[j]= [],
      here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
      path = [here],
      unvisited = [];
  for (var j = 0; j<x+2; j++) {
    unvisited[j] = [];
    for (var k= 0; k<y+1; k++)
      unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
  }
  while (0<n) {
    var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
        [here[0]-1, here[1]], [here[0],here[1]-1]];
    var neighbors = [];
    for (var j = 0; j < 4; j++)
      if (unvisited[potential[j][0]+1][potential[j][1]+1])
        neighbors.push(potential[j]);
    if (neighbors.length) {
      n = n-1;
      next= neighbors[Math.floor(Math.random()*neighbors.length)];
      unvisited[next[0]+1][next[1]+1]= false;
      if (next[0] == here[0])
        horiz[next[0]][(next[1]+here[1]-1)/2]= true;
      else 
        verti[(next[0]+here[0]-1)/2][next[1]]= true;
      path.push(here = next);
    } else 
      here = path.pop();
  }
  return {x: x, y: y, horiz: horiz, verti: verti};
}
 
function display(m) {
  var text= [];
  for (var j= 0; j<m.x*2+1; j++) {
    var line= [];
    if (0 == j%2)
      for (var k=0; k<m.y*4+1; k++)
        if (0 == k%4) 
          line[k]= '+';
        else
          if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
            line[k]= ' ';
          else
            line[k]= '-';
    else
      for (var k=0; k<m.y*4+1; k++)
        if (0 == k%4)
          if (k>0 && m.horiz[(j-1)/2][k/4-1])
            line[k]= ' ';
          else
            line[k]= '|';
        else
          line[k]= ' ';
    if (0 == j) line[1]= line[2]= line[3]= ' ';
    if (m.x*2-1 == j) line[4*m.y]= ' ';
    text.push(line.join('')+'\r\n');
  }
  return text.join('');
}

// convert gross maze return into list of line segments
function draw(m) {
  var coord= [], i, j;
  // note, m.x is height and m.y is width, doh!
  for(j=0; j<m.x; j++){
    coord.push(makeLine(0, j, 0, j+1, true));
    if(j<m.x-1)
      coord.push(makeLine(m.y, j, m.y, j+1, true));
  }
  for(i=0; i<m.y; i++){
    if(i>0)
      coord.push(makeLine(i, 0, i+1, 0, true));
    coord.push(makeLine(i, m.x, i+1, m.x, true));
  }
  for(j=0; j<m.x; j++){
    for(i=0; i<m.y-1; i++){
      if(!m.horiz[j][i])
        coord.push(makeLine(i+1, j, i+1, j+1, true));
    }
  }
  for(j=0; j<m.x-1; j++){
    for(i=0; i<m.y; i++){
      if(!m.verti[j][i])
        coord.push(makeLine(i, j+1, i+1, j+1, true));
    }
  }
  return coord;
}

function massScale(lines, x, y){
  for(var a=0; a<lines.length; a++){
    lines[a].c1 = lines[a].c1.scale(x, y);
    lines[a].c2 = lines[a].c2.scale(x, y);
  }
  return lines;
}

function drawLine() {
  // this is a straight line, in case you want to visualize rotation
  var coords = [
    makeLine(0,0,1,1,true),
    makeLine(1,1,2,2,true),
    makeLine(2,2,3,3,true),
    makeLine(3,3,4,4,true),
    makeLine(4,4,5,5,true),
    makeLine(5,5,6,6,true),
    makeLine(6,6,7,7,true),
    makeLine(7,7,8,8,true),
    makeLine(8,8,9,9,true),
    makeLine(9,9,10,10,true),
    makeLine(10,10,11,11,true),
    makeLine(11,11,12,12,true),
    makeLine(12,12,13,13,true),
    makeLine(13,13,14,14,true),
    makeLine(14,14,15,15,true)
  ]
  return coords;
}

var Coord = function(x, y){
  this.x = x;
  this.y = y;
}
Coord.prototype.translate = function(c, neg){
  if(neg !== -1){
    neg = 1;
  }
  var x2 = this.x + c.x * neg;
  var y2 = this.y + c.y * neg;
  var c = new Coord(x2, y2);
  return c;
}
Coord.prototype.scale = function(x, y){
  var x2 = this.x * x;
  var y2 = this.y * y;
  var c = new Coord(x2, y2);
  return c;
}
Coord.prototype.rotate = function(center, t){
  var c = this.translate(center, -1);
  var x2 = c.x * Math.cos(t) - c.y * Math.sin(t);
  var y2 = c.x * Math.sin(t) + c.y * Math.cos(t);
  c = new Coord(x2, y2);
  c = c.translate(center);
  return c;
}

var Line = function(c1, c2){
  this.c1 = c1;
  this.c2 = c2;
}

makeLine = function(x1, y1, x2, y2){
  var c1 = new Coord(x1, y1);
  var c2 = new Coord(x2, y2);
  var l = new Line(c1, c2);
  return l;
}

// start index on the 1, but we have 0 to prevent undefiend when doing index-1 or whatever
var fib = [0,1,1,2,3,5,8,13,21,34,55,89];
var START = 1;
var FIN = fib.length;

// try to follow a Fibonacci spiral, hmm
var Fibonacci = function(index, fib0){
  this.rotation = -Math.PI / 2 * (index - START); // rotate around in a spiral, these are negative for some reason
  this.width = fib[index]; // gets larger as sequence progresses, regardless of nodes
  this.height = fib[index];
  this.center = new Coord(0.5, 0.5); // used for rotation the maze around this coord, this happens before it is scaled to fit, which is why it uses X,Y instead of width

  // mazes enter in top left, exit in lower right
  // keep track so we can translate mazes around to fit
  var enter = new Coord(0, 0);
  this.exit = new Coord(1, 1);
  this.diff = null;
  
  this.doTheThing(enter); // called before diff is known

  // match our entrance with the previous exit
  if(fib0){
    var actual = fib0.exit;
    this.diff = new Coord(actual.x - enter.x, actual.y - enter.y);
  }

  this.doTheThing(this.exit); // called after diff is known, this is the real exit, will be used by next fib
  
};

Fibonacci.prototype.doTheThing = function(c0){
  var c = c0.rotate(this.center, this.rotation); // rotate before you translate, otherwise center will be wrong
  c = c.scale(this.width, this.height); // scale to fit
  
  // match your enter with previous exit, if it exists
  if(this.diff){
    c = c.translate(this.diff);
  }
  var x2 = c.x, y2 = c.y;

  c0.x = x2;
  c0.y = y2;
}


function go(id){
  var SCALE = 10;
  var EXTRA = 300; // just to make it not in the top left of the CANVAS, this exactly science

  var cont = document.getElementById(id);
  var CANVAS = document.createElement("canvas");
  CANVAS.width=1000;
  CANVAS.height=1000;
  cont.appendChild(CANVAS);

  // draws line segmens from an array of coordinates onto
  // the canvas, which is global
  function render(lines){
    var ctx = CANVAS.getContext("2d");
    for(var a=0; a<lines.length; a++){
      var line = lines[a];
      ctx.beginPath();
      ctx.moveTo(line.c1.x*SCALE + EXTRA, line.c1.y*SCALE + EXTRA);
      ctx.lineTo(line.c2.x*SCALE + EXTRA, line.c2.y*SCALE + EXTRA);
      ctx.stroke();
    }
  }

  var dobat0, dobat1; // keep track of previous thing, for moving into place
  var x0 = 2, y0 = 2; // number of nodes in initial maze
  for(var index=START; index<FIN; index++){
    var fibon = fib[index];
    // var X = x0, Y = y0; // constant number of nodes, maze grows as it rotates
    // var X = fibon * x0, Y = fibon * y0; // number of nodes increases at same rate as maze, to keep the "size" of the maze constant
    var X = Math.round(Math.sqrt(fibon * x0)), Y = Math.round(Math.sqrt(fibon * y0)); // number of nodes increases at a slower rate then maze
    dobat1 = new Fibonacci(index, dobat0);
    console.log(dobat1);
    var m = maze(X, Y);
    var lines = draw(m);
    lines = massScale(lines, 1/X, 1/Y); // maze will have width of X, to simplify math, we ignore all nodes and cram it into a 1x1 square

    lines.map(function(line){
      dobat1.doTheThing(line.c1);
      dobat1.doTheThing(line.c2);
    });
    render(lines);

    dobat0 = dobat1;
  }
}
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
Coord.prototype.scale = function(s){
  var x2 = this.x * s;
  var y2 = this.y * s;
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

// double in distance for ever quarter turn, golden spiral:
var Golden = function(X, Y, quarterTurns){
  this.center = new Coord(X / 2, Y / 2);
  this.phi = (1 + Math.sqrt(5)) / 2; // wikipedia
  this.quarterTurns = quarterTurns;
  this.rotation = (Math.PI / 2) * this.quarterTurns;
  this.scalar = Math.pow(this.phi, this.quarterTurns);
};
// this doens't work
Golden.prototype.doTheThing = function(c0){
  var c = c0.rotate(this.center, this.rotation);
  var x2 = c.x, y2 = c.y;

  x2 *= this.scalar;
  y2 *= this.scalar;

  c0.x = x2;
  c0.y = y2;
}

// start index on the 1, but we have 0 to prevent undefiend when doing index-1 or whatever
var fib = [0,1,1,2,3,5,8,13,21,34,55,89];
var START = 1;
var FIN = fib.length;

// try to follow a Fibonacci spiral, hmm
var Fibonacci = function(X, Y, index, fib0){
  this.rotation = -Math.PI / 2 * (index - START); // rotate around in a spiral, these are negative for some reason
  this.center = new Coord(X / 2, Y / 2); // used for rotation the maze around this coord
  this.scalar = fib[index]; // gets larger as sequence progresses

  // mazes enter in top left, exit in lower right
  // keep track so we can translate mazes around to fit
  var enter = new Coord(0, 0);
  this.doTheThing(enter); // called before previous is known
  this.diff = null;
  if(fib0){
    var actual = fib0.exit;
    this.diff = new Coord(actual.x - enter.x, actual.y - enter.y);
  }
  this.exit = new Coord(X, Y);
  this.doTheThing(this.exit);
};

Fibonacci.prototype.doTheThing = function(c0){
  var c = c0.rotate(this.center, this.rotation); // rotate before you translate, otherwise center will be wrong
  c = c.scale(this.scalar);
  // match your enter with previous exit, if it exists
  if(this.diff){
    c = c.translate(this.diff);
  }
  var x2 = c.x, y2 = c.y;

  c0.x = x2;
  c0.y = y2;
}


function go(id){
  var SCALE = 4;
  var X = 4, Y = 4;
  var EXTRA = 300; // this is just for stuffing in some extra space, its not very math

  var cont = document.getElementById(id);
  var CANVAS = document.createElement("canvas");
  CANVAS.width=SCALE * X + EXTRA * 2;
  CANVAS.height=SCALE * Y + EXTRA * 2;
  cont.appendChild(CANVAS);

  // draws line segmens from an array of coordinates onto
  // the canvas, which is global
  function render(coords){
    var ctx = CANVAS.getContext("2d");
    for(var a=0; a<coords.length; a++){
      var coord = coords[a];
      ctx.beginPath();
      ctx.moveTo(coord.c1.x*SCALE + EXTRA, coord.c1.y*SCALE + EXTRA);
      ctx.lineTo(coord.c2.x*SCALE + EXTRA, coord.c2.y*SCALE + EXTRA);
      ctx.stroke();
    }
  }

  var dobat0, dobat1; // keep track of previous thing, for moving into place
  for(var a=START; a<FIN; a++){
    dobat1 = new Fibonacci(X, Y, a, dobat0);
    console.log(dobat1);
    var m = maze(X, Y);
    console.log(m);
    var coords = draw(m);

    coords.map(function(coord){
      dobat1.doTheThing(coord.c1);
      dobat1.doTheThing(coord.c2);
    });
    console.log(coords);
    render(coords);

    dobat0 = dobat1;
  }
}
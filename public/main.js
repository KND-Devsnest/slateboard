var socket,
  URL = "http://localhost:8000";
let drawings = [];
/*socket = io.connect(URL);
socket.on("hi", (data) => {
  drawings = data;
  reDraw();
});

socket.on("someonesMouseMoved", (data) => {
  drawings.push(data);
  reDraw();
});
*/

document.oncontextmenu = () => false;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const penThickness = document.getElementById("thickness");
const colorPicker = document.getElementById("color-picker");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
// const socket = io("http://localhost:3000");
// socket.on("init", handleInit);
let shapeType = 'line';// [pen, circle, rectangle, square, line]
let painting = false;
let penSize = 10;
let penColor = "black";
let redo_drawings = [];
let currentDrawing = [];

penThickness.value = penSize;

function changePenSize(e) {
  console.log(e);
  penSize = e.target.value;
}

function redoDrawing() {
  // We have to redo only one stroke
  if (redo_drawings.length > 0) {
    painting = true;
    reDraw(redo_drawings[redo_drawings.length - 1]);
    painting = false;
    ctx.beginPath();
    drawings.push(redo_drawings.pop());
  }
}

function undoDraw(shouldIPop = true) {
  if(shouldIPop === true) {
    redo_drawings.push(drawings.pop()); //save values in redo array
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawings.forEach((el, inx) => {
    painting = true;
    reDraw(el);
    painting = false;
    ctx.beginPath();
  });
  ctx.strokeStyle = penColor;
  ctx.lineWidth = penSize;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawings = [];
  redo_drawings = [];
}

function reDraw(currentDrawing) {
  if (!painting) return;

  ctx.strokeStyle = currentDrawing["color"];
  ctx.lineWidth = currentDrawing["thickness"];
  currentDrawing["points"].forEach(({ x, y }, inx) => {
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  });
}

/*
// Example
currentDrawing = {
    points: [{x: , y: }, {x: , y: }, {x: , y: } ... ],
    strokeColor: 'red',
    strokeWidth: 12
}
*/

function startPosition(e) {
  console.log(drawings)
  painting = true;
  currentDrawing = { points: [], thickness: penSize, color: penColor, shapeType };
  console.log(currentDrawing);
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
  drawings.push(currentDrawing);
  currentDrawing = {};
}
function draw(e) {
  if (!painting) return;
  ctx.lineWidth = penSize;
  ctx.lineCap = "round";
  
  if(currentDrawing.shapeType == 'pen') {
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = penColor;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    currentDrawing["points"].push({ x: e.clientX, y: e.clientY });
  } else if(currentDrawing.shapeType == 'line') {
    if(currentDrawing.points.length == 0) {//first point of line
      currentDrawing.points.push({x: e.clientX, y: e.clientY})
      currentDrawing.points.push({x: e.clientX, y: e.clientY})
    }
    undoDraw(shouldIPop = false);
    painting = true;
    
    currentDrawing.points[1] = {x: e.clientX, y: e.clientY};
    ctx.beginPath();
    ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();//a mystery !
  }
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

penThickness.addEventListener("change", (e) => changePenSize(e));
colorPicker.addEventListener("change", (e) => {
  penColor = e.target.value;
  painting = false;
});

function handleInit(msg) {
  console.log(msg);
}

window.addEventListener("resize", (event) => {
  reDraw();
});

document.getElementById("pen").addEventListener("click", () => {
  document.getElementById("pen").classList.toggle("selected");
  document.getElementById("erase").classList.toggle("selected");
});

document.getElementById("erase").addEventListener("click", () => {
  document.getElementById("pen").classList.toggle("selected");
  document.getElementById("erase").classList.toggle("selected");
});
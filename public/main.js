document.oncontextmenu = () => false;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const penThickness = document.getElementById("thickness");
const colorPicker = document.getElementById("color-picker");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
// const socket = io("http://localhost:3000");
// socket.on("init", handleInit);
var socket,
  URL = "http://localhost:8000";
let drawings = [];
let painting = false;
let penSize = 10;
let penColor = "black";
let redo_drawings = [];
let currentDrawing = [];

penThickness.value = penSize;

socket = io.connect(URL);
socket.on("hello", (data) => {
  console.log(data);
  drawings = data;
  draw(drawings);
});

socket.on("someonesMouseMoved", (data) => {
  console.log(data);
  drawings.push(data);
  painting = true;
  reDraw(data);
  ctx.beginPath();
  painting = false;
});

socket.on("clearCanvas", () => {
  console.log("Someone cleared the canvas");
  delCanvas();
});
socket.on("undo", () => {
  console.log("Someone did UNDOD");
  undoit();
});

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
  socket.emit("userAction", "redo");
}

function undoDraw() {
  undoit();
  socket.emit("userAction", "undo");
}

function undoit() {
  redo_drawings.push(drawings.pop()); //save values in redo array
  console.log(drawings);
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
  delCanvas();
  socket.emit("userAction", "clear");
}

function delCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawings = [];
  redo_drawings = [];
}

function reDraw(currentDrawing) {
  if (!painting) return;
  console.log(currentDrawing["thickness"]);
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
  painting = true;
  currentDrawing = { points: [], thickness: penSize, color: penColor };
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
  console.log(currentDrawing);
  drawings.push(currentDrawing);
  socket.emit("someonesMouseMoved", currentDrawing);
}
function draw(e) {
  if (!painting) return;
  ctx.lineWidth = penSize;
  ctx.lineCap = "round";
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = penColor;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  //currentDrawing.push({ x: e.clientX, y: e.clientY });
  currentDrawing["points"].push({ x: e.clientX, y: e.clientY });
  //   console.log(drawings);
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
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  painting = true;
  //   reDraw(drawings);
  ctx.beginPath();
  painting = false;
});

document.getElementById("pen").addEventListener("click", () => {
  document.getElementById("pen").classList.toggle("selected");
  document.getElementById("erase").classList.toggle("selected");
});

document.getElementById("erase").addEventListener("click", () => {
  document.getElementById("pen").classList.toggle("selected");
  document.getElementById("erase").classList.toggle("selected");
});

var socket,
  URL = "http://localhost:8000";
let drawings = [];
socket = io.connect(URL);
socket.on("hi", (data) => {
  drawings = data;
  reDraw();
});

socket.on("someonesMouseMoved", (data) => {
  drawings.push(data);
  reDraw();
});

document.oncontextmenu = () => false;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const penThickness = document.getElementById("thickness");
const colorPicker = document.getElementById("color-picker");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
// const socket = io("http://localhost:3000");
// socket.on("init", handleInit);
let painting = false;
let penSize = 10;
let penColor = "black";
let redo_drawings = [];
let currentDrawing = [];

let maxX = 0, maxY = 0;
let minX = canvas.width, minY = canvas.height;

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

function undoDraw() {
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
  currentDrawing = { points: [{startX: e.clientX, startY: e.clientY}], thickness: penSize, color: penColor };
  //draw(e);
  
  drawRectangle(e);
}

function endPosition(e) {
  //drawRectangle(e);
  painting = false;
  ctx.beginPath();
  console.log(currentDrawing);
  console.log(maxX, maxY);
  drawings.push(currentDrawing);
  maxX = 0, maxY = 0
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


function drawRectangle(e){
  if (!painting) return;
  ctx.globalCompositeOperation='destination-over';
  ctx.lineWidth = penSize;
  ctx.lineCap = "round";
  let cdLength = currentDrawing['points'].length; 
  let startX = currentDrawing['points'][0]['startX'];
  let startY = currentDrawing['points'][0]['startY'];
  let x = cdLength == 1 ? currentDrawing['points'][cdLength-1]['startX'] : currentDrawing['points'][cdLength-1]['x'];
  let y = cdLength == 1 ? currentDrawing['points'][cdLength-1]['startY'] : currentDrawing['points'][cdLength-1]['y'];
  console.log(x, y);

  //for cleaning old re-render
  if (startX < x){
    if (startY < y) ctx.clearRect(startX, startY, x, y);
    else ctx.clearRect(startX - 10, startY, maxX, minY - startY - 10);
  }else{
    if (startY < y) ctx.clearRect(startX, startY, minX - startX - 10 , y);
    else ctx.clearRect(startX, startY, minX - startX - 10, minY - startY - 10);
  }

  //for removing extra lines left while resizing!
  if (startX < x){
    if (startY < y){
      ctx.clearRect(startX - 10, y, x, maxY);
      ctx.clearRect(x, startY - 10, maxX, y);
    }
    else {
      console.log("topl");
      ctx.clearRect(startX - 10, y, x, minY - startY - 10);
      ctx.clearRect(x, startY - 10, minX, y);
    }
  }else{
    if (startY < y) {
      ctx.clearRect(startX + 10, y, minX - startX - 10, maxY);
      ctx.clearRect(x, startY - 10, minX - startX - 10, y);
    }
    else {
      ctx.clearRect(startX + 10, y, minX - startX - 20, maxY);
      ctx.clearRect(startX + 10, y, minX - startX - 20, minY - startY);
      
    }
  }

  // ctx.clearRect(startX - 10, y, x, maxY);
  // ctx.clearRect(x, startY - 10, maxX, y);

  const width = e.clientX - currentDrawing['points'][0]['startX'];
  const height = e.clientY - currentDrawing['points'][0]['startY'];
  ctx.rect(currentDrawing['points'][0]['startX'], currentDrawing['points'][0]['startY'], width, height);
  ctx.strokeStyle = penColor;
  ctx.stroke();   
  ctx.beginPath();
  if (e.clientX > maxX) maxX = e.clientX;
  else if (e.clientX < minX) minX = e.clientX;
  if (e.clientY > maxY) maxY = e.clientY;
  else if (e.clientY < minY) minY = e.clientY;
  currentDrawing["points"].push({ x: e.clientX, y: e.clientY });
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", drawRectangle);

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

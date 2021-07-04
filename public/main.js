var socket;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// canvas.width = document.body.width;
// canvas.height = document.body.height;

let drawings = [];
// socket = io.connect("http://localhost:8000");
// socket.on("hi", (data) => {
//   drawings = data;
//   draw();
// });

// socket.on("someonesMouseMoved", (data) => {
//   drawings.push(data);
//   draw();
// });

let painting = false;

function startPosition(e) {
  painting = true;
  draw(e);
}
function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = 0;
  ctx.lineCap = "round";
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.stroke();
  ctx.moveTo(e.clientX, e.clientY);
  drawings.push({ x: e.clientX, y: e.clientY });
  console.log(drawings);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

function handleInit(msg) {
  console.log(msg);
}

document.oncontextmenu = () => false;

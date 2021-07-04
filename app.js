const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const socket = io("http://localhost:3000");
socket.on("init", handleInit);
let painting = false;
const lolxd = [];
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
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  lolxd.push({ x: e.clientX, y: e.clientY });
  console.log(lolxd);
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

function handleInit(msg) {
  console.log(msg);
}

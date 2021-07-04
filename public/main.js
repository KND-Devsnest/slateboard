var socket;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawings = [];
socket = io.coonect("http://localhost:8000");
socket.on("hi", (data) => {
  drawings = data;
  renderCanvas();
});

socket.on("someonesMouseMoved", (data) => {
  drawings.push(data);
  renderCanvas();
});

let x, y, prevX, prevY;

document.oncontextmenu = () => false;

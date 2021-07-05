// variables
let painting = false;
let penSize = 10;
let penColor = "black";
let redo_drawings = [];
let currentDrawing = [];
let shapeType = "pen"; // [line, square, rectangle, circle, ellipse, eraser]

const shapebtn = document.querySelector(".shapes");
shapebtn.addEventListener("click", () => {
  shapebtn.classList.toggle("expanded");

  let shapes = document.querySelectorAll(".shape");
  shapes.forEach((e) => {
    e.classList.toggle("show");
  });
});

let shapes = document.querySelectorAll(".shape");
shapes.forEach((e) => {
  e.addEventListener("click", () => console.log(e));
});

const colbtns = document.querySelectorAll(".col");
colbtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // console.log(btn);
    let col = btn.dataset.col;
    document.querySelector(".pen").style.color = col;
    penColor = col;
  });
});

var socket,
  URL1 = "http://localhost:8000";
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

canvas.height = window.innerHeight - 0.05 * window.innerHeight;
canvas.width = window.innerWidth - 0.03 * window.innerWidth;

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// const socket = io("http://localhost:3000");
// socket.on("init", handleInit);

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
  if (shouldIPop === true) {
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

  if (currentDrawing.shapeType === "eraser") {
    ctx.fillStyle = currentDrawing.color;
    currentDrawing.points.forEach((item, index) => {
      ctx.beginPath();
      ctx.fillRect(item.x, item.y, item.length, item.length);
    });
  } else if (
    currentDrawing.shapeType === "ellipse" ||
    currentDrawing.shapeType === "circle"
  ) {
    let centerX = Math.floor(
        (currentDrawing.points[0].x + currentDrawing.points[1].x) / 2
      ),
      centerY = Math.floor(
        (currentDrawing.points[0].y + currentDrawing.points[1].y) / 2
      );
    ctx.beginPath();
    console.log(centerX, centerY);
    ctx.ellipse(
      centerX,
      centerY,
      currentDrawing.points[1].x - centerX,
      currentDrawing.shapeType === "ellipse"
        ? currentDrawing.points[1].y - centerY
        : currentDrawing.points[1].x - centerX,
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.beginPath();
  } else {
    // polygon
    currentDrawing["points"].forEach(({ x, y }, inx) => {
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });
  }
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
  console.log(e);

  painting = true;
  currentDrawing = {
    points: [],
    thickness: penSize,
    color: shapeType == "eraser" ? "red" : penColor,
    shapeType,
  };
  console.log(currentDrawing);
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
  if (currentDrawing.shapeType === "rectangle") {
    let x1 = currentDrawing.points[0].x,
      y1 = currentDrawing.points[0].y,
      x2 = currentDrawing.points[1].x,
      y2 = currentDrawing.points[1].y;
    currentDrawing.points = [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 },
      { x: x1, y: y1 },
    ];
  } else if (currentDrawing.shapeType === "square") {
    let x1 = currentDrawing.points[0].x,
      y1 = currentDrawing.points[0].y,
      x2 = currentDrawing.points[1].x,
      y2 = y1 + (x2 - x1);
    currentDrawing.points = [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 },
      { x: x1, y: y1 },
    ];
  }
  drawings.push(currentDrawing);
  currentDrawing = {};
}
function draw(e) {
  console.log(e);
  if (shapeType === "eraser") {
    undoDraw((shouldIPop = false));
    let halfLength = Math.max(20, Math.floor((penSize * 10) / 2));
    let x = e.offsetX - halfLength,
      y = e.offsetY - halfLength;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.rect(x, y, 2 * halfLength, 2 * halfLength);
    ctx.strokeStyle = "black";
    ctx.stroke();
    //ctx.begin();
  }

  if (!painting) return;
  ctx.lineWidth = penSize;
  ctx.lineCap = "round";

  if (currentDrawing.shapeType == "pen") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = penColor;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    currentDrawing["points"].push({ x: e.offsetX, y: e.offsetY });
  } else if (currentDrawing.shapeType == "line") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
    }
    undoDraw((shouldIPop = false));
    painting = true;

    currentDrawing.points[1] = { x: e.offsetX, y: e.offsetY };
    ctx.beginPath();
    ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath(); //a mystery !
  } else if (currentDrawing.shapeType == "rectangle") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
    }
    undoDraw((shouldIPop = false));
    painting = true;
    currentDrawing.points[1] = { x: e.offsetX, y: e.offsetY };
    ctx.beginPath();
    /*
      (x1, y1) ----------------- (x2, y1)
               |                |
               |                |
               ------------------(x2,y2)
          (x1, y2)
    */
    ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.lineTo(e.offsetX, currentDrawing.points[0].y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(currentDrawing.points[0].x, e.offsetY);
    ctx.lineTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.stroke();
    ctx.beginPath();
  } else if (currentDrawing.shapeType == "square") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
    }
    undoDraw((shouldIPop = false));
    painting = true;
    currentDrawing.points[1] = { x: e.offsetX, y: e.offsetY };
    ctx.beginPath();

    let x1 = currentDrawing.points[0].x,
      y1 = currentDrawing.points[0].y,
      x2 = e.offsetX,
      y2 = y1 + (x2 - x1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.beginPath();
  } else if (currentDrawing.shapeType === "ellipse") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
    }
    console.log("ellipse, here");
    undoDraw((shouldIPop = false));
    painting = true;
    currentDrawing.points[1] = { x: e.offsetX, y: e.offsetY };
    let centerX = Math.floor((currentDrawing.points[0].x + e.offsetX) / 2),
      centerY = Math.floor((currentDrawing.points[0].y + e.offsetY) / 2);
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      e.offsetX - centerX,
      e.offsetY - centerY,
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.beginPath();
    //console.log(centerX, centerY, e.offsetX-centerX, e.offsetY - centerY, Math.PI / 4, 0, 2 * Math.PI);
  } else if (currentDrawing.shapeType === "circle") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
      currentDrawing.points.push({ x: e.offsetX, y: e.offsetY });
    }
    undoDraw((shouldIPop = false));
    painting = true;
    let x1 = currentDrawing.points[0].x,
      y1 = currentDrawing.points[0].y,
      x2 = e.offsetX,
      y2 = y1 + (x2 - x1);
    currentDrawing.points[1] = { x: e.offsetX, y: y2 };
    let centerX = Math.floor((x1 + x2) / 2),
      centerY = Math.floor((y1 + y2) / 2);
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      Math.abs(e.offsetX - centerX),
      Math.abs(e.offsetX - centerX),
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.beginPath();
    console.log(centerX, centerY);
    //console.log(centerX, centerY, e.offsetX-centerX, e.offsetY - centerY, Math.PI / 4, 0, 2 * Math.PI);
  } else if (currentDrawing.shapeType === "eraser") {
    console.log("here");
    let halfLength = Math.max(20, Math.floor((penSize * 10) / 2));
    let x = e.offsetX - halfLength,
      y = e.offsetY - halfLength;
    ctx.fillStyle = "red"; // temporary
    ctx.beginPath();
    ctx.fillRect(x, y, halfLength * 2, halfLength * 2);
    currentDrawing.points.push({ x, y, length: halfLength * 2 });
  }
}

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

penThickness.addEventListener("change", (e) => changePenSize(e));
colorPicker.addEventListener("change", (e) => {
  penColor = e.target.value;
  painting = false;
  document.querySelector(".pen").style.color = penColor;
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

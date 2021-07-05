// variables
let painting = false;
let penSize = 10;
let penColor = "black";
let redo_drawings = [];
let currentDrawing = {};
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
  e.addEventListener("click", () => {
    shapeType = e.dataset.shape;
    console.log(e.dataset.shape);
    changeCursor(shapeType);
  });
});

// https://stackoverflow.com/questions/45962081/css-cursor-pointer-with-svg-image
function changeCursor(shapeType) {
  switch (shapeType) {
    case "square":
      canvas.style.cursor = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-square'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/></svg>")
      16 16,
    crosshair`;
      break;
    case "circle":
      canvas.style.cursor = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-circle'><circle cx='12' cy='12' r='10'/></svg>") 16 16, crosshair`;
      break;
    case "pen":
      canvas.style.cursor = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-edit-2'><path d='M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z'/></svg>") 16 16, crosshair`;
      break;
    case "eraser":
      canvas.style.cursor = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' stroke-linejoin='round' class='feather feather-sidebar'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect><path d='M3 9h18'></path></svg>") 16 16, crosshair`;
      break;
    default:
      canvas.style.cursor = "crosshair";
      return;
  }
}

const colbtns = document.querySelectorAll(".col");
colbtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // console.log(btn);
    let col = btn.dataset.col;
    document.querySelector(".pen").style.color = col;
    penColor = col;
  });
});

document.getElementById("pen").addEventListener("click", () => {
  undoDraw((shouldIPop = false));
  shapeType = "pen";
  changeCursor(shapeType);
  document.getElementById("pen").classList.toggle("selected");
  document.getElementById("erase").classList.toggle("selected");
});

document.getElementById("erase").addEventListener("click", () => {
  shapeType = "eraser";
  changeCursor(shapeType);
  document.getElementById("pen").classList.toggle("selected");
  document.getElementById("erase").classList.toggle("selected");
});

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
  if (shouldIPop === true && drawings.length > 0) {
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

  if (
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
      Math.abs(currentDrawing.points[1].x - centerX),
      Math.abs(
        currentDrawing.shapeType === "ellipse"
          ? currentDrawing.points[1].y - centerY
          : currentDrawing.points[1].x - centerX
      ),
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
  console.log(drawings);
  painting = true;
  currentDrawing = {
    points: [],
    thickness: penSize,
    color: shapeType == "eraser" ? "white" : penColor,
    shapeType,
  };
  //console.log(currentDrawing);
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
  console.log(drawings);
  currentDrawing = {};
}
function draw(e) {
  if (shapeType === "eraser" && painting === false) {
    //console.log(e.type, 'here');
    undoDraw((shouldIPop = false));
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(e.clientX, e.clientY, penSize / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
  }
  /*if (shapeType === "eraser") {
    undoDraw((shouldIPop = false));
    let halfLength = Math.max(20, Math.floor((penSize * 10) / 2));
    let x = e.clientX - halfLength,
      y = e.clientY - halfLength;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.rect(x, y, 2 * halfLength, 2 * halfLength);
    ctx.strokeStyle = "black";
    ctx.stroke();
    //ctx.begin();
  }*/

  if (!painting) return;
  ctx.lineWidth = penSize;
  ctx.lineCap = "round";

  if (
    currentDrawing.shapeType == "pen" ||
    currentDrawing.shapeType == "eraser"
  ) {
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = currentDrawing.shapeType == "eraser" ? "white" : penColor;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    currentDrawing["points"].push({ x: e.clientX, y: e.clientY });
  } else if (currentDrawing.shapeType == "line") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
    }
    undoDraw((shouldIPop = false));
    painting = true;

    currentDrawing.points[1] = { x: e.clientX, y: e.clientY };
    ctx.beginPath();
    ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath(); //a mystery !
  } else if (currentDrawing.shapeType == "rectangle") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
    }
    undoDraw((shouldIPop = false));
    painting = true;
    currentDrawing.points[1] = { x: e.clientX, y: e.clientY };
    ctx.beginPath();
    /*
      (x1, y1) ----------------- (x2, y1)
               |                |
               |                |
               ------------------(x2,y2)
          (x1, y2)
    */
    ctx.moveTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.lineTo(e.clientX, currentDrawing.points[0].y);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.lineTo(currentDrawing.points[0].x, e.clientY);
    ctx.lineTo(currentDrawing.points[0].x, currentDrawing.points[0].y);
    ctx.stroke();
    ctx.beginPath();
  } else if (currentDrawing.shapeType == "square") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
    }
    undoDraw((shouldIPop = false));
    painting = true;
    currentDrawing.points[1] = { x: e.clientX, y: e.clientY };
    ctx.beginPath();

    let x1 = currentDrawing.points[0].x,
      y1 = currentDrawing.points[0].y,
      x2 = e.clientX,
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
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
    }
    console.log("ellipse, here");
    undoDraw((shouldIPop = false));
    painting = true;
    currentDrawing.points[1] = { x: e.clientX, y: e.clientY };
    let centerX = Math.floor((currentDrawing.points[0].x + e.clientX) / 2),
      centerY = Math.floor((currentDrawing.points[0].y + e.clientY) / 2);
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      Math.abs(e.clientX - centerX),
      Math.abs(e.clientY - centerY),
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.beginPath();
    //console.log(centerX, centerY, e.clientX-centerX, e.clientY - centerY, Math.PI / 4, 0, 2 * Math.PI);
  } else if (currentDrawing.shapeType === "circle") {
    if (currentDrawing.points.length == 0) {
      //first point of line
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
      currentDrawing.points.push({ x: e.clientX, y: e.clientY });
    }
    undoDraw((shouldIPop = false));
    painting = true;
    let x1 = currentDrawing.points[0].x,
      y1 = currentDrawing.points[0].y,
      x2 = e.clientX,
      y2 = y1 + (x2 - x1);
    currentDrawing.points[1] = { x: e.clientX, y: y2 };
    let centerX = Math.floor((x1 + x2) / 2),
      centerY = Math.floor((y1 + y2) / 2);
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      Math.abs(e.clientX - centerX),
      Math.abs(e.clientX - centerX),
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
    ctx.beginPath();
    console.log(centerX, centerY);
    //console.log(centerX, centerY, e.clientX-centerX, e.clientY - centerY, Math.PI / 4, 0, 2 * Math.PI);
  } else if (currentDrawing.shapeType === "eraser") {
    console.log("here");
    let halfLength = Math.max(20, Math.floor((penSize * 10) / 2));
    let x = e.clientX - halfLength,
      y = e.clientY - halfLength;
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

var express = require("express");
var socket = require("socket.io");
var app = express();
app.use(express.static("public"));
var server = app.listen(8000);
var io = socket(server);
io.sockets.on("connection", newConnection);
var drawings = [];
let redo_drawings = [];
function newConnection(socket) {
  console.log("new connection" + socket.id);
  socket.emit("hello", drawings);
  console.log(drawings);
  socket.on("someonesMouseMoved", mouseMsg);
  socket.on("userAction", userAction);
  function mouseMsg(data) {
    drawings.push(data);
    socket.broadcast.emit("someonesMouseMoved", data);
  }
  function userAction(choice) {
    switch (choice) {
      case "undo":
        console.log("Someone did undo");
        undo();
        break;
      case "redo":
        console.log("Someone did redo");
        redo();
        break;
      case "clear":
        console.log("Someone cleared the canvas");
        clearCanvas();
        break;
      default:
        break;
    }
  }

  function undo() {
    redo_drawings.push(drawings.pop());
    socket.broadcast.emit("undo");
  }
  function redo() {
    if (redo_drawings.length > 0) {
      let data = redo_drawings.pop();
      socket.broadcast.emit("someonesMouseMoved", data);
    }
    return;
  }
  function clearCanvas() {
    drawings = [];
    redo_drawings = [];
    socket.broadcast.emit("clearCanvas");
  }
}

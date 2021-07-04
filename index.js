var express = require("express");
var socket = require("socket.io");
var app = express();
app.use(express.static("public"));
var server = app.listen(8000);
var io = socket(server);
io.sockets.on("connection", newConnection);
const drawings = [];
function newConnection(socket) {
  console.log("new connection" + socket.id);
  socket.emit("hello", drawings);
  console.log(drawings);
  socket.on("mouse", mouseMsg);
  function mouseMsg(data) {
    drawings.push(data);
    socket.broadcast.emit("mouse", data);
  }
}

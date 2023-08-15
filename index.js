/*
const io = require("socket.io")(8000);
const obj = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("name:", name);
    obj[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("messageSent", (message) => {
    socket.broadcast.emit("receive", { message, name: obj[socket.id] });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", obj[socket.id] );
    delete obj[socket.id];
  });
});
*/
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  console.log('req:', req)
});

const obj = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("name:", name);
    obj[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("messageSent", (message) => {
    socket.broadcast.emit("receive", { message, name: obj[socket.id] });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", obj[socket.id]);
    delete obj[socket.id];
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
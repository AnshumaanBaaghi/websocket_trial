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

const { default: axios } = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("Working");
});
const fetchdata = async () => {
  const res = await axios(
    "https://websocket-trial-jsonserver.onrender.com/Users/1"
  );
  return res.data;
};
fetchdata();
setTimeout(() => {
  io.on("connection", (socket) => {
    socket.on("new-user-joined", async (name) => {
      console.log("name:", name);
      const obj = await fetchdata();
      obj[socket.id] = name;
      await axios.put(
        "https://websocket-trial-jsonserver.onrender.com/Users/1",
        obj
      );
      socket.broadcast.emit("user-joined", name);
    });
    socket.on("messageSent", (message) => {
      socket.broadcast.emit("receive", { message, name: obj[socket.id] });
    });
    socket.on("disconnect", async () => {
      socket.broadcast.emit("left", obj[socket.id]);
      const obj = await fetchdata();
      delete obj[socket.id];
      await axios.put(
        "https://websocket-trial-jsonserver.onrender.com/Users/1",
        obj
      );
    });
  });
}, 1000);

const port = process.env.PORT || 3000;
console.log("process.env.PORT:", process.env.PORT);

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

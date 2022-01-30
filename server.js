const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const io = require("socket.io")(3100);
const mongoose = require("mongoose");

app.use(bodyParser.json());

const Users = require("./UserModel");

mongoose.connect(process.env.DB_URL, function (err) {
  if (err) {
    throw err;
  }
  console.log("Database connected");

  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("joinRoom", (data) => {
      console.log("user joined room");
      socket.join(data.myId);

      setTimeout(async () => {
        const user = new Users({ name: "papago", age: 42, myId: data.myId });
        await user.save();
      }, 2000);
    });

    socket.on("background", () => console.log("===> background"));
    socket.on("disconnect", () => console.log("===> disconnect ", socket.id));
  });

  Users.watch().on("change", (change) => {
    console.log(
      "Something has changed",
      JSON.stringify(change.fullDocument, null, 2)
    );
    io.sockets
      .to(change.fullDocument.myId)
      .emit("changes", change.fullDocument);
  });
});

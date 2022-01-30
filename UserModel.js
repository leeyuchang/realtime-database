const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  myId: String,
});

module.exports = mongoose.model("Users", UserSchema);

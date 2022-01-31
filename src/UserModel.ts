// const mongoose = require("mongoose");
import { model, Schema } from "mongoose";

type User = {
  name: string;
  age: number;
  myId: string;
};

const schema = new Schema<User>({
  name: String,
  age: Number,
  myId: String,
});

// export default mongoose.model("Users", UserSchema);

export default model<User>("User", schema);

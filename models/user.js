import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login: String,
  password: String,
});

export default mongoose.model("user", userSchema);

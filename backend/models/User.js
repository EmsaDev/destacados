import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  cc: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  }
});

export default mongoose.model("User", userSchema);

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";

mongoose.connect("mongodb://localhost:27017/destacados");

async function crearUsuario() {
  const hashed = await bcrypt.hash("123456789", 10);
  const user = new User({ username: "test", password: hashed, role: "user" });
  await user.save();
  console.log("Usuario creado ✅",user.username, user.role);
  process.exit();
}

crearUsuario();
import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password:string) {
        return password.length >= 8;
      },
      message: "Password must be at least 8 characters long.",
    },
  },
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error  as Error);
    }
  });
  
  userSchema.methods.comparePassword = async function (password:string) {
    if (!password) throw new Error("Password Missing");
  
    try {
      return bcrypt.compare(password, this.password);
    } catch (error) {
      return console.log("error:", error);
    }
  };
  
  const Users = mongoose.model("Users", userSchema);
  module.exports = Users;
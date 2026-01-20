import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password:{
      type: String,
      required: true,
      minlength: 6,
    }
})

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model("User" , userSchema);

import mongoose from "mongoose";
import validator from "validator"
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: [true, "please write a unique email"],
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password cannot contain 'password' ");
      }
    },
  },
 
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
   passwordChangedAt: Date,
});

userSchema.methods.ChangePasswordAfer = function (JwtTimeStamp) {
  console.log("test");
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < changeTimestamp;
  }
  return false;
};

const User=mongoose.model("User",userSchema);
export default User;
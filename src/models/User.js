import mongoose from "mongoose";
import brcypt from "bcrypt";
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String },
  email: { type: String, required: true },
  avatarUrl: { type: String, default: "/img/newYearCard.jpg" },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
  ],
  socialOnly: Boolean,
  location: String,
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await brcypt.hash(this.password, 6);
  }
});

const User = mongoose.model("User", userSchema);

export default User;

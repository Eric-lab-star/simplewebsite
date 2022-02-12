import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  img: String,
  username: String,
  createdAt: {
    type: String,
    default: new Date().toLocaleString(),
  },
  userId: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

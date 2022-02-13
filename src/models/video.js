import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
  title: String,
  description: String,
  hashtag: [{ type: String }],
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  createdAt: {
    type: String,
    default: new Date().toISOString().substring(0, 10),
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],

  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

videoSchema.static("formatHashtag", function (hashtag) {
  return hashtag
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;

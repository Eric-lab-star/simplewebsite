import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
  title: String,
  description: String,
  hashtag: [{ type: String }],
  file: String,
  createdAt: { type: Date, default: new Date() },
  path: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

videoSchema.static("formatHashtag", function (hashtag) {
  return hashtag
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;

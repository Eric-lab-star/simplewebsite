import Video from "../models/video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const { key } = req.query;

  let videos = await Video.find().populate("owner").sort({ createdAt: "desc" });

  if (key) {
    videos = await Video.find({
      title: { $regex: new RegExp(key, "i") },
    })
      .populate("owner")
      .sort({ createdAt: "desc" });
  }
  res.render("home", { pageTitle: "home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.find()
    .populate("owner")
    .sort({ createdAt: "desc" });
  const video = await Video.findById(id).populate("owner").populate("comments");

  const fullURL = req.protocol + "://" + req.get("host") + req.originalUrl;

  res.render("watch", { pageTitle: video.title, video, videos, fullURL });
  return;
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Watch" });

  return;
};

export const postUpload = async (req, res) => {
  const { title, description, hashtag } = req.body;
  const {
    loggedInUser: { _id },
  } = req.session;

  const video = await Video.create({
    title,
    description,
    fileUrl: req.files.videoFile[0].location,
    thumbnailUrl: req.files.thumbnailFile[0].location,
    hashtag: Video.formatHashtag(hashtag),
    owner: _id,
  });

  const user = await User.findById(_id);
  user.videos.push(video._id);
  user.save();

  res.redirect("/");
  return;
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render("editVideo", { pageTitle: "Edit Video", video });
  return;
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtag } = req.body;

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtag: Video.formatHashtag(hashtag),
  });
  res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  await Video.findByIdAndDelete(id);
  res.redirect("/");
};

//BTNs
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.views = video.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const addLike = async (req, res) => {
  console.log("ok");
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.likes = video.likes + 1;
  await video.save();
  return res.sendStatus(200);
};
export const removeLike = async (req, res) => {
  console.log("ok");
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.likes = video.likes - 1;
  await video.save();
  return res.sendStatus(200);
};

export const addDislike = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.dislikes = video.dislikes + 1;
  await video.save();
  return res.sendStatus(200);
};

export const removeDislike = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.dislikes = video.dislikes - 1;
  await video.save();
  return res.sendStatus(200);
};

export const addComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { loggedInUser },
  } = req;

  const video = await Video.findById(id);
  const user = await User.findById(loggedInUser._id);

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: loggedInUser._id,
    video: id,
    img: loggedInUser.avatarUrl,
    username: loggedInUser.username,
    userId: loggedInUser._id,
  });
  video.comments.push(comment._id);
  user.comments.push(comment._id);
  video.save();
  user.save();
  res.status(201).json({ commentId: comment._id });
};

export const addLikeAndDislike = async (req, res) => {
  const {
    body: { id, className },
  } = req;

  if (className === "far fa-thumbs-up") {
    const comment = await Comment.findById(id);
    comment.likes = comment.likes + 1;
    comment.save();
    res.sendStatus(200);
    return;
  }
  if (className === "far fa-thumbs-down") {
    const comment = await Comment.findById(id);
    comment.dislikes = comment.dislikes + 1;
    comment.save();
    res.sendStatus(200);
    return;
  }
};

export const deleteComment = async (req, res) => {
  const {
    body: { id },
  } = req;
  const comment = await Comment.findByIdAndDelete(id);
  if (comment) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
};

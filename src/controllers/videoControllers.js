import Video from "../models/video";
import User from "../models/User";

export const home = async (req, res) => {
  const { key } = req.query;
  let videos = await Video.find({}).sort({ createdAt: "desc" });
  if (key) {
    videos = await Video.find({
      title: { $regex: new RegExp(key, "i") },
    }).sort({ createdAt: "desc" });
  }

  res.render("home", { pageTitle: "home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");

  res.render("watch", { pageTitle: "Watch", video });

  return;
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Watch" });

  return;
};

export const postUpload = async (req, res) => {
  const { title, description, hashtag } = req.body;
  const { path } = req.file;
  const {
    loggedInUser: { _id },
  } = req.session;

  const video = await Video.create({
    title,
    description,
    path,
    hashtag: Video.formatHashtag(hashtag),
    owner: _id,
  });

  await User.findByIdAndUpdate(_id, {
    videos: video._id,
  });

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

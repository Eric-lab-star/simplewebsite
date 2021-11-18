import Video from "../models/video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });

  res.render("home", { pageTitle: "home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render("watch", { pageTitle: "Watch", video });

  return;
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Watch" });
  return;
};

export const postUpload = async (req, res) => {
  const { title, description, hashtag } = req.body;

  await Video.create({
    title,
    description,
    hashtag: Video.formatHashtag(hashtag),
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

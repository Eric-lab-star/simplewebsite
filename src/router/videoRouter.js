import { uploadVideo, notLoggedIn } from "../middleware";
import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoControllers";

const videoRouter = express.Router();
videoRouter.route("/:id([a-f0-9]{24})").get(watch);
videoRouter
  .route("/upload")
  .get(notLoggedIn, getUpload)
  .post(uploadVideo.single("video"), postUpload);
videoRouter
  .route("/:id([a-f0-9]{24})/edit")
  .get(notLoggedIn, getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", notLoggedIn, deleteVideo);
export default videoRouter;

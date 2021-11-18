import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
} from "../controllers/videoControllers";
import Video from "../models/video";

const videoRouter = express.Router();
videoRouter.route("/:id([a-f0-9]{24})").get(watch);
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.route("/:id([a-f0-9]{24})/edit").get(getEdit).post(postEdit);
export default videoRouter;

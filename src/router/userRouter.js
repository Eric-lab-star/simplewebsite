import express from "express";
import {
  getProfile,
  postProfile,
  getEditProfile,
  postEditProfile,
} from "../controllers/userControllers";
import { uploadProfile } from "../middleware";
const userRouter = express.Router();

userRouter.route("/:id([0-9a-f]{24})").get(getProfile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditProfile)
  .post(uploadProfile.single("uploadProfile"), postEditProfile);

export default userRouter;

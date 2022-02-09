import express from "express";
import {
  getProfile,
  postProfile,
  getEditProfile,
  postEditProfile,
  getEditPassword,
  postEditPassword,
} from "../controllers/userControllers";
import { uploadProfile, notLoggedIn } from "../middleware";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", notLoggedIn, getProfile);

userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(notLoggedIn, getEditProfile)
  .post(uploadProfile.single("uploadProfile"), postEditProfile);

userRouter
  .route("/:id([0-9a-f]{24})/editPassword")
  .get(notLoggedIn, getEditPassword)
  .post(postEditPassword);

export default userRouter;

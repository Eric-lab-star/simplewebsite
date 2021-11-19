import express from "express";
import {
  getProfile,
  postProfile,
  getEditProfile,
  postEditProfile,
  getEditPassword,
  postEditPassword,
} from "../controllers/userControllers";
import { uploadProfile } from "../middleware";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", getProfile);

userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditProfile)
  .post(uploadProfile.single("uploadProfile"), postEditProfile);

userRouter
  .route("/:id([0-9a-f]{24})/editPassword")
  .get(getEditPassword)
  .post(postEditPassword);

export default userRouter;

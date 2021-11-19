import express from "express";
import {
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
  getGitLogin,
  endGitLogin,
} from "../controllers/userControllers";
import { home } from "../controllers/videoControllers";
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", logout);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.route("/gitLogin").get(getGitLogin);
globalRouter.route("/callbackurl").get(endGitLogin);

export default globalRouter;

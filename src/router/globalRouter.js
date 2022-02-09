import express from "express";
import {
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
  getGitLogin,
  endGitLogin,
  getGoogle,
  endGoogle,
  test,
} from "../controllers/userControllers";
import { home } from "../controllers/videoControllers";
import { isloggedIn, notLoggedIn } from "../middleware";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", notLoggedIn, logout);
globalRouter.route("/join").get(isloggedIn, getJoin).post(postJoin);
globalRouter.route("/login").get(isloggedIn, getLogin).post(postLogin);
globalRouter.route("/gitLogin").get(isloggedIn, getGitLogin);
globalRouter.route("/callbackurl").get(isloggedIn, endGitLogin);
globalRouter.route("/google").get(isloggedIn, getGoogle);
globalRouter.route("/endGG").get(isloggedIn, endGoogle);

export default globalRouter;

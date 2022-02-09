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
import { banLoggedInUser, notLoggedIn } from "../middleware";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", logout);
//app
globalRouter.route("/join").get(banLoggedInUser, getJoin).post(postJoin);
globalRouter.route("/login").get(banLoggedInUser, getLogin).post(postLogin);
//git login
globalRouter.route("/gitLogin").get(banLoggedInUser, getGitLogin);
globalRouter.route("/callbackurl").get(banLoggedInUser, endGitLogin);
// google
globalRouter.route("/google").get(banLoggedInUser, getGoogle);
globalRouter.route("/endGG").get(banLoggedInUser, endGoogle);

export default globalRouter;

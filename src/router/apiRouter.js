import express from "express";
import {
  registerView,
  addLike,
  removeLike,
  addDislike,
  removeDislike,
} from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/video/:id([a-f0-9]{24})/view", registerView);

apiRouter.post("/video/:id([a-f0-9]{24})/addLikeBtn", addLike);
apiRouter.post("/video/:id([a-f0-9]{24})/removeLikeBtn", removeLike);
apiRouter.post("/video/:id([a-f0-9]{24})/addDislikeBtn", addDislike);
apiRouter.post("/video/:id([a-f0-9]{24})/removeDislikeBtn", removeDislike);

export default apiRouter;

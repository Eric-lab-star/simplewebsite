import express from "express";
import { registerView } from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/video/:id([a-f0-9]{24})/view", registerView);

export default apiRouter;

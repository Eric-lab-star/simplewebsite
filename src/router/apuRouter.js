import express from "express";
import { apiView } from "../controllers/videoControllers";

const apiRouter = express.Router();

apiRouter.post("/video/:id([a-f0-9]{24})/views", apiView);

export default apiRouter;

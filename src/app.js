import "dotenv/config";
import "./db";
import express from "express";
import globalRouter from "./router/globalRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import userRouter from "./router/userRouter";
import videoRouter from "./router/videoRouter";
import apiRouter from "./router/apiRouter";
import flash from "express-flash";
const app = express();

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/img", express.static("img"));
// url, static("파일이름")
app.use("/assets", express.static("assets"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
    }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/api", apiRouter);

app.listen(40000, console.log("server is listening to http://localhost:40000"));

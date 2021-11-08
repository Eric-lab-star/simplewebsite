import "dotenv/config";
import "./db";
import express from "express";
import globalRouter from "./router/globalRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import userRouter from "./router/userRouter";

const app = express();

app.listen(40000, console.log("server is listening to http://localhost:40000"));

app.set("views", process.cwd() + "/src/views");
app.use("/uploads", express.static("uploads"));
app.set("view engine", "pug");
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
app.use(localsMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/user", userRouter);

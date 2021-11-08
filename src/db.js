import mongoose from "mongoose";

mongoose.connect(process.env.MONGOURL);

const db = mongoose.connection;

db.on("error", (err) => {
  logError(err);
});

db.once("open", () => {
  console.log("connected to DB");
});

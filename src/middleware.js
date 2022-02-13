import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: `sleepingking-youtubeclone`,
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  next();
};

export const uploadProfile = multer({
  dest: "uploads/profile",
  limits: { fieldSize: 8601085 },
  storage: multerUploader,
});

export const uploadVideo = multer({
  dest: "uploads/videos",
  limits: { fieldSize: 8601085 },
  storage: multerUploader,
});

export const banLoggedInUser = (req, res, next) => {
  if (req.session.loggedInUser) {
    req.flash("error", "You are Logged In");
    res.redirect("/");
  } else {
    next();
  }
};

export const notLoggedIn = (req, res, next) => {
  if (!req.session.loggedInUser) {
    req.flash("error", "You are Not Logged In");
    res.redirect("/");
  } else {
    next();
  }
};

export const paginatedResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    console.log(page, limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previouse = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};

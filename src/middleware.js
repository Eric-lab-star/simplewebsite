import req from "express/lib/request";
import multer from "multer";
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  next();
};

export const uploadProfile = multer({ dest: "uploads/profile" });

export const uploadVideo = multer({
  dest: "uploads/videos",
  limits: { fieldSize: 8601085 },
});

export const isloggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    res.redirect("/");
  } else {
    next();
  }
};

export const notLoggedIn = (rea, res, next) => {
  if (!req.session.loggedInUser) {
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

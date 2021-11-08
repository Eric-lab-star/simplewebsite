import multer from "multer";
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedInUser = req.session.loggedInUser;
  next();
};

export const uploadProfile = multer({ dest: "uploads/profile" });

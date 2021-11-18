import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
  return;
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.render("login", {
      pageTitle: "Login",
      errorMessage: "This user does not exits",
    });
    return;
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    res.render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password",
    });
    return;
  }

  req.session.loggedInUser = user;
  res.redirect("/");
  return;
};

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, username, password, password2, email } = req.body;
  const user = await User.exists({ $or: [{ name }, { username }, { email }] });
  if (password !== password2) {
    res.render("join", {
      pageTitle: "Join",
      errorMessage: "Wrong password",
    });
    return;
  }

  if (user) {
    res.render("join", {
      pageTitle: "Join",
      errorMessage: "This name or username or email is already taken",
    });
    return;
  }
  await User.create({
    name,
    username,
    password,
    email,
  });
  res.redirect("/login");
  return;
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
  return;
};

export const getProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.render("profile", { pageTitle: "Profile", user });
  return;
};

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
  return;
};

export const postEditProfile = async (req, res) => {
  const {
    file,
    params: { id },
    body: { username, name, email },
    session: { avatarUrl },
  } = req;

  const exist = await User.exists({ $or: [{ username }, { name }, { email }] });
  if (file) {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        avatarUrl: file.path,
      },
      { new: true }
    );
    req.session.loggedInUser = updateUser;
  }

  if (exist) {
    const user = await User.findById(id);
    if (
      username === user.username &&
      name === user.name &&
      email === user.email
    ) {
      res.redirect(`/user/${id}`);
      return;
    }
    res.render("editProfile", {
      pageTitle: "Edit Profile",
      errorMessage: "this username or name or email exists",
    });
    return;
  }

  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      username,
      name,
      email,
      avatarUrl: file ? file.path : avatarUrl,
    },
    { new: true }
  );

  req.session.loggedInUser = updateUser;
  res.redirect(`/user/${id}`);
  return;
};

export const getEditPassword = (req, res) => {
  res.render("changePassword", { pageTitle: "Edit Password" });
  return;
};

export const postEditPassword = async (req, res) => {
  const { id } = req.params;
  const pageTitle = "Edit Password";
  const { currentPassword, newPassword1, newPassword2 } = req.body;
  const user = await User.findById(id);

  const ok = await bcrypt.compare(currentPassword, user.password);

  if (!ok) {
    res.render("changePassword", {
      pageTitle,
      errorMessage: "Wrong Current Password",
    });
    return;
  }

  if (newPassword1 !== newPassword2) {
    res.render("changePassword", {
      pageTitle,
      errorMessage: "New Password does not Match",
    });
    return;
  }

  user.password = newPassword1;
  user.save();
  req.session.user = user;
  res.redirect("/");
  return;
};

import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

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
  const user = await User.findById(id).populate("videos");
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
        avatarUrl: `/${file.path}`,
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
  console.log(file);
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      username,
      name,
      email,
      avatarUrl: file ? `/${file.path}` : avatarUrl,
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

export const getGitLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const endGitLogin = async (req, res) => {
  const baseUrl = `https://github.com/login/oauth/access_token`;
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com/user";
    const userData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/join");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
        avatarUrl: userData.avatar_url,
      });
    } else {
      req.session.loggedInUser = user;
      return res.redirect("/");
    }
  }
};
//google login
export const getGoogle = (req, res) => {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const config = {
    client_id: process.env.GG_CLIENT,
    redirect_uri: "http://localhost:40000/endGG",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  res.redirect(finalUrl);
};

export const endGoogle = async (req, res) => {
  const { code } = req.query;
  const baseUrl = "https://oauth2.googleapis.com/token";
  const config = {
    client_secret: process.env.GG_SECRET,
    client_id: process.env.GG_CLIENT,
    code,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:40000/endGG",
  };
  const params = new URLSearchParams(config);
  const finalURL = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  const { access_token } = tokenRequest;
  const { id_token } = tokenRequest;

  const data = await (
    await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
  ).json();

  const token = jwt.sign(data, process.env.JWT_SECRET);

  const googleUser = jwt.verify(token, process.env.JWT_SECRET);

  let user = await User.findOne({ email: googleUser.email });

  if (!user) {
    user = await User.create({
      name: googleUser.name,
      username: googleUser.id,
      email: googleUser.email,
      password: "",
      socialOnly: true,
      location: googleUser.locale,
      avatarUrl: googleUser.picture,
    });
    req.session.loggedInUser = user;
    return res.redirect("/");
  } else {
    req.session.loggedInUser = user;
    return res.redirect("/");
  }
};

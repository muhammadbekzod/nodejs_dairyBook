const db = require("../models/index");
const bcrypt = require("bcryptjs");
const User = db.user;

//Desc      GET login page
//Route     GET /auth/my
//Access    Public
const getLoginPage = async (req, res) => {
  try {
    const isAuthenicated = req.session.isLogged;
    res.render("auth/login", {
      title: "Login",
      isAuthenicated,
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      login user
//Route     POST /auth/my
//Access    Public
const loginUser = async (req, res) => {
  try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        userExist.password
      );
      if (matchPassword) {
        req.session.isLogged = true;
        req.session.user = userExist;
        req.session.save((err) => {
          if (err) throw err;
          return res.redirect("/diary/my");
        });
      } else {
        return res.redirect("/auth/login");
      }
    } else {
      return res.redirect("/auth/login");
    }
  } catch (err) {
    console.log(err);
  }
};

//Desc      logout user
//Route     POST /auth/logout
//Access    Private

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

//Desc      GET registration page
//Route     GET /auth/registration
//Access    Public
const getRegisterPage = async (req, res) => {
  try {
    res.render("auth/registration", {
      title: "Registration",
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      GET register new user
//Route     POST /auth/registration
//Access    Public
const registerUser = async (req, res) => {
  try {
    const { email, name, password, password2 } = req.body;
    if (password !== password2) {
      return res.redirect("/auth/registration");
    }
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
      return res.redirect("/auth/registration");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      email,
      name,
      password: hashedPassword,
    });
    return res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getLoginPage,
  loginUser,
  logout,
  getRegisterPage,
  registerUser,
};

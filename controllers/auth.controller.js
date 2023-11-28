const db = require("../models/index");
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
    req.session.isLogged = true;
    req.session.user = {
      id: 1,
      email: "user@gmail.com",
      name: "user",
      password: "1234567",
    };
    req.session.save((err) => {
      if (err) throw err;
      res.redirect("/diary/my");
    });
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

module.exports = { getLoginPage, loginUser, logout };

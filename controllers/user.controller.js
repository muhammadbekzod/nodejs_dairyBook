const db = require("../models/index");
const bcrypt = require("bcryptjs");
const User = db.user;
const Diary = db.diary;
//Desc      GETㅕㄴㄷㄱ profile page
//Route     GET /user/profile/:id
//Access    Private

const getUserProfile = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id }, raw: true });
  const diaries = await Diary.findAll({
    where: { userId: user.id },
    raw: true,
  });
  try {
    res.render("user/profile", {
      title: user.name,
      user: user,
      diariesLength: diaries.length,
      isAuthenicated: req.session.isLogged,
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      GET my profile page
//Route     GET /user/profile/my
//Access    Private

const getMyProfile = async (req, res) => {
  const user = req.session.user;
  const diaries = await Diary.findAll({
    where: { userId: user.id },
    raw: true,
  });
  console.log(diaries);
  try {
    res.render("user/myprofile", {
      title: user.name,
      user: user,
      diariesLength: diaries.length,
      isAuthenicated: req.session.isLogged,
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      GET update profile page
//Route     GET /user/profile/update
//Access    Private

const updateProfilePage = async (req, res) => {
  const user = req.session.user;

  try {
    res.render("user/update-profile", {
      title: user.name,
      user: user,
      isAuthenicated: req.session.isLogged,
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      update profile
//Route     POST /user/profile/update
//Access    Private

const updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.session.user.id },
      raw: true,
    });
    if (req.body.email === user.email) {
      return res.redirect("/user/profile/update");
    }
    const newDetails = await User.update(
      {
        name: req.body.name,
        email: req.body.email,
      },
      {
        where: { id: req.session.user.id },
        returning: true,
        raw: true,
        plain: true,
      }
    );
    req.session.user = newDetails[1];
    req.session.save((err) => {
      if (err) throw err;
      return res.redirect("/user/profile/my");
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getUserProfile,
  getMyProfile,
  updateProfilePage,
  updateProfile,
};

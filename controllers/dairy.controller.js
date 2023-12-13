const db = require("../models/index");
const { Op } = require("sequelize");
const User = db.user;
const Diary = db.diary;
const Comment = db.comment;
const { validationResult } = require("express-validator");

//Desc      GET all my diaries page
//Route     GET /diary/my
//Access    Private
const getMydiary = async (req, res) => {
  try {
    // console.log(req.session.user);

    const diaries = await Diary.findAll({
      where: { userId: req.session.user.id },
      raw: true,
      plain: false,
      include: ["user"],
      nest: true,
    });
    res.render("diary/my-diary", {
      title: "My Diary",
      diaries: diaries.reverse(),
      isAuthenicated: req.session.isLogged,
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      GET all diaries
//Route     GET /diary/all
//Access    Private
const getAlldiary = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const itemLimit = 2;
    // console.log(req.query.page);
    const diaries = await Diary.findAll({
      // where: { userId: { [Op.ne]: req.session.user.id } },
      raw: true,
      plain: false,
      include: ["user"],
      nest: true,
      limit: itemLimit,
      offset: (page - 1) * itemLimit,
    });
    const totalData = await Diary.count();
    const lastPage = Math.ceil(totalData / itemLimit);
    res.render("diary/all-diary", {
      title: "All Diary",
      diaries: diaries.reverse(),
      isAuthenicated: req.session.isLogged,
      totalData: totalData,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: page * itemLimit < totalData,
      hasPrevPage: page - 1,
      lastPage: lastPage,
      currentPageAndPrevPageNotEqualOne: page !== 1 && page - 1 !== 1,
      lastPageChacking: lastPage !== page && page + 1 !== lastPage,
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      add new diary
//Route     POST /diary/my
//Access    Private
const addNewDiary = async (req, res) => {
  try {
    const { text } = req.body;
    // console.log(req.file);
    // console.log(req.text);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const diaries = await Diary.findAll({
        where: { userId: req.session.user.id },
        raw: true,
        plain: false,
        include: ["user"],
        nest: true,
      });
      return res.status(400).render("diary/my-diary", {
        title: "My Dairies",
        isAuthenicated: req.session.isLogged,
        diaries: diaries.reverse(),
        errorMessage: errors.array()[0].msg,
      });
    }

    const fileUrl = req.file ? "/uploads/" + req.file.filename : "";

    await Diary.create({
      imageUrl: fileUrl,
      text: text,
      userId: req.session.user.id,
    });
    res.redirect("/diary/my");
  } catch (err) {
    console.log(err);
  }
};

//Desc      GET diary
//Route     GET /diary/my
//Access    Private
const getDiaryById = async (req, res) => {
  try {
    const data = await Diary.findByPk(req.params.id, {
      raw: false,
      plain: true,
      include: ["comment", "user"],
      nest: true,
      isAuthenicated: req.session.isLogged,
    });

    const diary = await data.toJSON();
    // console.log(diary);
    res.render("diary/one-diary", {
      title: "Diary",
      diary: diary,
      comments: diary.comment.reverse(),
      errorMessage: req.flash("error"),
    });
    // console.log(diary);
  } catch (err) {
    console.log(err);
  }
};

//Desc      Update diary
//Route     GET /diary/update/:id
//Access    Private
const updateDiaryPage = async (req, res) => {
  try {
    const diary = await Diary.findByPk(req.params.id, {
      raw: true,
    });
    res.render("diary/update-diary", {
      title: "Edit Diary",
      diary: diary,
    });
  } catch (err) {
    console.log(err);
  }
};

//Desc      Update diary
//Route     POST /diary/update/:id
//Access    Private
const updateDiary = async (req, res) => {
  try {
    await Diary.update(
      {
        text: req.body.text,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.redirect("/diary/my");
  } catch (err) {
    console.log(err);
  }
};

//Desc      Delete diary
//Route     POST /diary/update/:id
//Access    Private
const deleteDiary = async (req, res) => {
  try {
    await Diary.destroy({
      where: { id: req.params.id },
    });
    res.redirect("/diary/my");
  } catch (err) {
    console.log(err);
  }
};

//Desc      Add comment
//Route     POST /diary/comment/:id
//Access    Private
const addCommentDiary = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    if (req.body.comment === "") {
      req.flash("error", "Please add your comment");
      return res.redirect("/diary/" + req.params.id);
    }
    await Comment.create({
      name: user.name,
      comment: req.body.comment,
      diaryId: req.params.id,
      userId: user.id,
    });
    res.redirect("/diary/" + req.params.id);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getMydiary,
  addNewDiary,
  getDiaryById,
  updateDiaryPage,
  deleteDiary,
  updateDiary,
  addCommentDiary,
  getAlldiary,
};

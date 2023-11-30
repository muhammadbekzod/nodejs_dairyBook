const db = require("../models/index");
const { Op } = require("sequelize");
const User = db.user;
const Diary = db.diary;
const Comment = db.comment;
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
    // console.log(req.session.user);
    const diaries = await Diary.findAll({
      where: { userId: { [Op.ne]: req.session.user.id } },
      raw: true,
      plain: false,
      include: ["user"],
      nest: true,
    });
    res.render("diary/all-diary", {
      title: "All Diary",
      diaries: diaries.reverse(),
      isAuthenicated: req.session.isLogged,
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
    const { imageUrl, text } = req.body;
    await Diary.create({
      imageUrl: imageUrl,
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
const geDiaryById = async (req, res) => {
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
  geDiaryById,
  updateDiaryPage,
  deleteDiary,
  updateDiary,
  addCommentDiary,
  getAlldiary,
};

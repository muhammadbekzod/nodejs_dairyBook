const { Router } = require("express");
const {
  getMydiary,
  addNewDiary,
  geDiaryById,
  updateDiaryPage,
  updateDiary,
  deleteDiary,
  addCommentDiary,
  getAlldiary,
} = require("../controllers/dairy.controller");
const router = Router();
const { protected } = require("../middlewares/auth");

router.get("/my", protected, getMydiary);
router.get("/all", protected, getAlldiary);
router.post("/add", protected, addNewDiary);

router.get("/update/:id", protected, updateDiaryPage);
router.post("/update/:id", protected, updateDiary);
router.post("/delete/:id", protected, deleteDiary);

router.post("/comment/:id", protected, addCommentDiary);

router.get("/:id", protected, geDiaryById);
module.exports = router;

const { Router } = require("express");
const {
  getMydiary,
  addNewDiary,
  geDiaryById,
  updateDiaryPage,
  updateDiary,
  deleteDiary,
  addCommentDiary,
} = require("../controllers/dairy.controller");
const router = Router();

router.get("/my", getMydiary);
router.post("/add", addNewDiary);

router.get("/update/:id", updateDiaryPage);
router.post("/update/:id", updateDiary);
router.post("/delete/:id", deleteDiary);
router.post("/comment/:id", addCommentDiary);

router.get("/:id", geDiaryById);
module.exports = router;

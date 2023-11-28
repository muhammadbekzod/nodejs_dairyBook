const { Router } = require("express");
const {
  getMydiary,
  addNewDiary,
  geDiaryById,
  updateDiaryPage,
  updateDiary,
  deleteDiary,
} = require("../controllers/dairy.controller");
const router = Router();

router.get("/my", getMydiary);
router.post("/add", addNewDiary);
router.get("/:id", geDiaryById);
router.get("/update/:id", updateDiaryPage);
router.post("/update/:id", updateDiary);
router.post("/delete/:id", deleteDiary);
module.exports = router;

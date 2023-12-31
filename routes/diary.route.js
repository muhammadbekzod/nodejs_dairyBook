const { Router } = require("express");
const {
  getMydiary,
  addNewDiary,
  getDiaryById,
  updateDiaryPage,
  updateDiary,
  deleteDiary,
  addCommentDiary,
  getAlldiary,
} = require("../controllers/dairy.controller");
const router = Router();
const { protected } = require("../middlewares/auth");
const { body, check } = require("express-validator");
const upload = require("../utils/fileUpload");

router.get("/my", protected, getMydiary);
router.get("/all", protected, getAlldiary);
router.post(
  "/add",
  upload.single("imageUrl"),
  body("text", "Please at least 3 characters").isLength({ min: 3 }),

  protected,
  addNewDiary
);

router.get("/update/:id", protected, updateDiaryPage);
router.post("/update/:id", protected, updateDiary);
router.post("/delete/:id", protected, deleteDiary);

router.post("/comment/:id", protected, addCommentDiary);

router.get("/:id", protected, getDiaryById);
module.exports = router;

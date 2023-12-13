const { Router } = require("express");
const {
  getLoginPage,
  loginUser,
  logout,
  getRegisterPage,
  registerUser,
} = require("../controllers/auth.controller");
const router = Router();
const { guest, protected } = require("../middlewares/auth");
const { body, check } = require("express-validator");

router.get("/login", guest, getLoginPage);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter valid email address"),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],

  guest,
  loginUser
);

router.get("/logout", protected, logout);

router.get("/registration", guest, getRegisterPage);
router.post(
  "/registration",
  [
    body("email", "Please add valid email address").isEmail(),
    body("name", "Name can contain only ALPHABETICAL characters").isAlpha(),
    body("password", "Password must be at least 6 characters")
      .isLength({
        min: 6,
      })
      .isAlphanumeric(),
  ],
  guest,
  registerUser
);

module.exports = router;

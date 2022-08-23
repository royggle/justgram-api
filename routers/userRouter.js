const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/signup", userController.createUser); //user 등록
router.post("/login", userController.loginUser); //로그인

module.exports = router;

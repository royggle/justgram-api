const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/postup", postController.postCreate); //post 등록
router.get("/postsearch", postController.postsearch); //Read 1 전체 조회
router.get("/getuserwithpost", postController.postSearchwithUser); // read2
router.patch("/postupdate", postController.postUpdate); //post 업데이트
router.delete("/delete", postController.postDelete); //삭제 포스트

module.exports = router;

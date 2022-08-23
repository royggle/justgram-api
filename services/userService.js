const userDao = require("../models/userDao");
//서비스는 오로지 dao에 의존
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const createUser = async (email, nickname, password, profile_image) => {
  const salt = bcrypt.genSaltSync(12);
  const hashedPw = bcrypt.hashSync(password, salt);
  return await userDao.createUser(email, nickname, hashedPw, profile_image);
};

const loginUser = async (email, password) => {
  const user = await userDao.loginUser(email);
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) return 2;
  if (user && isPasswordCorrect) {
    const token = jwt.sign({ userId: user.id }, "secretKey");
    return token;
  }
};

module.exports = { createUser, loginUser };

const postDao = require("../models/postDao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const postCreate = async (user_id, content) => {
  return await postDao.postCreate(user_id, content);
};

const postSearch = async () => {
  return await postDao.postSearch();
};

const postSearchwithUser = async (user_id) => {
  return await postDao.postSearchwithUser(user_id);
};

const postUpdate = async (postingId, postingTitle, postingContent) => {
  return await postDao.postUpdate(postingId, postingTitle, postingContent);
};

const postDelete = async (postingId) => {
  return await postDao.postDelete(postingId);
};
module.exports = {
  postCreate,
  postSearch,
  postSearchwithUser,
  postUpdate,
  postDelete,
};

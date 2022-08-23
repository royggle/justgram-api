const postService = require("../services/postService");

const postCreate = async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const user = await postService.postCreate(user_id, content);
    res.status(201).json({ message: "postCreated" });
  } catch {
    res.status(500).json({ message: "CANNOT CREATE POST" });
  }
};
const postsearch = async (req, res) => {
  try {
    const user = await postService.postsearch();
    res.status(201).json({ data: user });
  } catch {
    res.status(500).json({ message: "error" });
  }
};
const postSearchwithUser = async (req, res) => {
  const { user_id } = req.body;

  try {
    const user = await postService.postSearchwithUser(user_id);
    let value = JSON.parse(JSON.stringify(user));
    let newArr = [];
    value.forEach((element) => {
      const { postingId, postingImageUrl, postingContent } = element;
      newArr.push({ postingId, postingImageUrl, postingContent });
    });
    res.status(201).json({
      data: {
        user_id,
        userProfileImage: value[0].userProfileImage,
        postings: newArr,
      },
    });
  } catch {
    res.status(500).json({ message: "error" });
  }
};
const postUpdate = async (req, res) => {
  const { postingId, postingTitle, postingContent } = req.body;
  try {
    const value = await postService.postUpdate(
      postingId,
      postingTitle,
      postingContent
    );
    res.status(201).json({ data: value });
  } catch {
    res
      .status(500)
      .json({ message: "Error : cannot search updated post. ", error });
  }
};

const postDelete = async (req, res) => {
  const { postingId } = req.body;
  try {
    await postService.postDelete(postingId);
    res.status(201).json({ message: "userDeleted" });
  } catch {
    res.status(500).json({ message: "deleteError" });
  }
};

module.exports = {
  postCreate,
  postsearch,
  postSearchwithUser,
  postUpdate,
  postDelete,
};

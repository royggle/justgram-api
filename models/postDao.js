const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch(() => {
    console.log("failed to initialize!");
  });

const postCreate = async (user_id, content) => {
  return await myDataSource.query(
    `INSERT INTO postings(user_id, contents)
    VALUES (?, ?)
    `,
    [user_id, content]
  );
};

const postSearch = async () => {
  return await myDataSource.query(
    `SELECT users.id as userId, users.profile_image as userProfileImage, postings.id as postingId, posting_images.image_url as postingImageUrl, postings.contents as postingContent FROM users INNER JOIN postings ON users.id = postings.user_id INNER JOIN posting_images ON posting_images.posting_id = postings.id`
  );
};

const postSearchwithUser = async (user_id) => {
  return await myDataSource.query(
    `SELECT users.profile_image as userProfileImage, postings.id as postingId, posting_images.image_url as postingImageUrl, postings.contents as postingContent FROM users INNER JOIN postings ON users.id = postings.user_id INNER JOIN posting_images ON posting_images.posting_id = postings.id WHERE users.id = ${user_id}`
  );
};

const postUpdate = async (postingId, postingTitle, postingContent) => {
  const update = await myDataSource.query(
    `UPDATE postings SET title = ?, contents = ? WHERE id = ?`,
    [postingTitle, postingContent, postingId]
  );

  const search = await myDataSource.query(
    `SELECT users.id as userId, users.nickname as userName, postings.id as postingId, postings.title as postingTitle, postings.contents as postingContent FROM postings INNER JOIN users ON postings.user_id = users.id WHERE postings.id = ${postingId}`
  );

  return search;
};

const postDelete = async (postingId) => {
  await myDataSource.query(
    `DELETE FROM comments WHERE comments.posting_id = ?`,
    [postingId]
  );
  const deletePost = await myDataSource.query(
    `DELETE FROM postings WHERE id = ?`,
    postingId
  );
  return deletePost;
};

module.exports = {
  postCreate,
  postSearch,
  postSearchwithUser,
  postUpdate,
  postDelete,
};

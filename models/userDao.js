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

const createUser = async (email, nickname, hashedPw, profile_image) => {
  return await myDataSource.query(
    `INSERT INTO users(email, nickname, password, profile_image)
    VALUES (?, ?, ?, ?)
    `,
    [email, nickname, hashedPw, profile_image]
  );
};

const loginUser = async (email) => {
  const [userAccount] = await myDataSource.query(
    `SELECT id, email, nickname, password FROM users where email = ?`,
    [email]
  );
  return userAccount;
};

module.exports = { createUser, loginUser };

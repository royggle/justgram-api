const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require("typeorm");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("process");

//console.log(process.env);

const express = require("express");
const cors = require("cors");

const morgan = require("morgan");

const app = express();
const port = 8000;

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

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

//로그인
app.post("/login", async (req, res) => {
  const { userEmail } = req.body;
  const [userAccount] = await myDataSource.query(
    `SELECT id, email, nickname, password FROM users where email = ?`,
    [userEmail]
  );
  //사용자 비교
  if (!userAccount) {
    console.log("No User");
    res.status(400).json({ message: "NO_USER" });
  }
  //비밀번호 비교
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    res.status(400).json({ message: "INVALID PASSWORD" });
  }
  //token 생성
  const token = jwt.sign({ userId: user.id }, "secretKey");
  res.status(200).json({ message: "LOGIN_SUCCESWS", token: token });
});

//user 등록
app.post("/signup", (req, res) => {
  const { email, nickname, password, profile_image } = req.body;
  const hasKey = { password: false, nickname: false, email: false };
  const requireKey = Object.keys(hasKey);

  const salt = bcrypt.genSaltSync(12);
  console.log("before encrypted : ", password);
  console.log("salt : ", salt);

  const hashedPw = bcrypt.hashSync(password, salt);
  console.log("after encrypted : ", hashedPw);
  const queryRes = myDataSource.query(
    `INSERT INTO users(email, nickname, password, profile_image)
    VALUES (?, ?, ?, ?)
    `,
    [email, nickname, hashedPw, profile_image]
  );
  queryRes
    .then(() => {
      res.status(201).json({ message: "userCreated" });
    })
    .catch(() => {
      res.status(500).json({ message: "error" });
    });
});
//post 등록
app.post("/postup", (req, res) => {
  const { user_id, content } = req.body;
  const queryRes = myDataSource.query(
    `INSERT INTO postings(user_id, contents)
    VALUES (?, ?)
    `,
    [user_id, content]
  );

  queryRes
    .then(() => {
      res.status(201).json({ message: "postCreated" });
    })
    .catch(() => {
      res.status(500).json({ message: "error" });
    });
});

//Read 1 전체 조회
app.get("/postsearch", (req, res) => {
  const queryRes = myDataSource.query(
    `SELECT users.id as userId, users.profile_image as userProfileImage, postings.id as postingId, posting_images.image_url as postingImageUrl, postings.contents as postingContent FROM users INNER JOIN postings ON users.id = postings.user_id INNER JOIN posting_images ON posting_images.posting_id = postings.id`
  );
  queryRes
    .then((value) => {
      res.status(201).json({ data: value });
    })
    .catch(() => {
      res.status(500).json({ message: "error" });
    });
});
// read2
app.get("/getuserwithpost", (req, res) => {
  const { user_id } = req.body;
  const queryRes = myDataSource.query(
    `SELECT users.profile_image as userProfileImage, postings.id as postingId, posting_images.image_url as postingImageUrl, postings.contents as postingContent FROM users INNER JOIN postings ON users.id = postings.user_id INNER JOIN posting_images ON posting_images.posting_id = postings.id WHERE users.id = ${user_id}`
  );

  queryRes
    .then((value) => {
      value = JSON.parse(JSON.stringify(value));
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
    })
    .catch(() => {
      res.status(500).json({ message: "error" });
    });
});

app.patch("/postupdate", (req, res) => {
  const { userId, userName, postingId, postingTitle, postingContent } =
    req.body;
  const queryRes = myDataSource.query(
    `UPDATE postings SET title = ?, contents = ? WHERE id = ?`,
    [postingTitle, postingContent, postingId]
  );

  queryRes
    .then(() => {
      myDataSource
        .query(
          `SELECT users.id as userId, users.nickname as userName, postings.id as postingId, postings.title as postingTitle, postings.contents as postingContent FROM postings INNER JOIN users ON postings.user_id = users.id WHERE postings.id = ${postingId}`
        )
        .then((value) => {
          console.log(value);
          res.status(201).json({ data: value });
        })
        .catch(() => {
          res
            .status(500)
            .json({ message: "Error : cannot search updated post. ", error });
        });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error : cannot update the post. ", error });
    });
});

//삭제 포스트
app.delete("/delete", (req, res) => {
  const { postingId } = req.body;
  const queryRes = myDataSource.query(
    `DELETE FROM postings WHERE id = ?`,
    postingId
  );

  queryRes.then(() => {});
});

app.listen(port, () => {
  console.log("server is listening on PORT 8000");
});

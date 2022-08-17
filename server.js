const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require("typeorm");

//console.log(process.env);

const express = require("express");
const cors = require("cors");
const logger = require("morgan");

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
    // const queryRes = myDataSource.query("SELECT * FROM users");
    // queryRes.then((value) => {
    //   console.log(value);
    // });
  })
  .catch(() => {
    console.log("failed to initialize!");
  });

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/ping", (req, res) => {
  res.json({ message: "/ pong" });
});

// app.post("/signup", createUser);
// app.post("/postup", createPost);
// app.get("/postsearch", searchPost);
// app.patch("/postupdate", updatePost);
// app.delete("/delete", deletePost);
// app.get("/getuserwithpost", userPlusPost);

app.listen(port, () => {
  console.log("server is listening on PORT 8000");
});

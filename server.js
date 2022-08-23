const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const express = require("express");
const router = require("./routers");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(router);
app.use(cors());
app.use(morgan("combined"));

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on PORT 8000");
});

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require('cors');
const mysql = require("mysql2/promise");


const { compress } = require("./utils/compression");
const userRouter = require("./users/userRouter");
const questionRouter = require("./questions/questionRouter");
const answerRouter = require("./answers/answerRouter");
const commentRouter = require("./comments/commentRouter");

const port = process.env.PORT || 1000;
const app = express();


app.use(compress);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/question", questionRouter);
app.use("/answer" , answerRouter);
app.use("/comment", commentRouter);


app.get("/", (req, res) => {
  res.status(200).send("Welcome to Stack Overflow Clone!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  (async function testConnection() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectTimeout: 90000,
        port : process.env.DB_PORT
      });
      console.log('Connected to the database');
      await connection.end();
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  })();
});

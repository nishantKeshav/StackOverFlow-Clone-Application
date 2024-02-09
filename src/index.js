const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const { compress } = require("./utils/compression");
const userRouter = require("./users/userRouter");
const questionRouter = require("./questions/questionRouter");
const answerRouter = require("./answers/answerRouter");
const commentRouter = require("./comments/commentRouter");

const port = process.env.PORT || 1000;
const app = express();

app.use( compress);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/question", questionRouter);
app.use("/answer" , answerRouter);
app.use("/comment", commentRouter);


app.get("/", (req, res) => {
  res.status(200).send("Welcome to Stack Overflow Clone!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

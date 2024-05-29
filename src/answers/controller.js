const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { customError } = require("../utils/customError.js");

const { checkQuestionIdQuery } = require("../answers/query.js");
const { insertAnswerQuery } = require("../answers/query.js");
const { checkAnswerIdQuery } = require("../answers/query.js");
const { updateAnswerQuery } = require("../answers/query.js");
const { deleteAnswerQuery } = require("../answers/query.js");
const { executeQuery } = require("../utils/db.js");
const { send_response } = require("../utils/response.js");

const SECRET_KEY = process.env.SECRET_KEY;

let response_output;

createAnswer = async (req, res) => {
       const {question_id , content} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              console.log(token)
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const answerId = uuidv4();
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifquestionExists = await questionExists(question_id);
              if (!ifquestionExists) {
                     throw new customError("Question does not exist." , 400);
              } 
              const questionOwnerUser_id = await getUserIDFromQuestionId(question_id);
              const ifquestionUserSame = await compareUsers(loggedinUserId , questionOwnerUser_id);
              if (ifquestionUserSame) {
                     throw new customError("Unauthorized. You cannot answer your own question." , 400);
              }
              await executeQuery(insertAnswerQuery(), [answerId , content , question_id , loggedinUserId]);
              response_output = {"statusCode" : 200 , "Message" : "Answer added successfully" , "Data": {"Content" : content}}
       } catch (error) {
              if (error.message === "JsonWebTokenError") {
                     response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
                     return;
              }
              response_output = {"statusCode" : 500 , "Message" : error.message , "Data": null}
       } finally {
              return send_response(res , response_output); 
       }
};


updateAnswer = async (req, res) => {
       const {answer_id , content} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifanswerExists = await answerExists(answer_id);
              if (!ifanswerExists) {
                     throw new customError("Answer does not exist." , 400);
              } 
              const answerOwnerUser_id = await getUserIDFromAnswerId(answer_id);
              const ifanswerUserSame = await compareUsers(loggedinUserId , answerOwnerUser_id);
              if (!ifanswerUserSame) {
                     throw new customError("Unauthorized. You cannot update the answer" , 400);
              }
              await executeQuery(updateAnswerQuery(), [content , answer_id]);
              response_output = {"statusCode" : 200 , "Message" : "Answer updated successfully" , "Data": {"Conetnt" : content}}
       } catch (error) {
              if (error.message === "JsonWebTokenError") {
                     response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
                     return;
              }
              response_output = {"statusCode" : 500 , "Message" : error.message , "Data": null}
       } finally {
              return send_response(res , response_output); 
       }
};

deleteAnswer = async (req, res) => {
       const {answer_id} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifanswerExists = await answerExists(answer_id);
              if (!ifanswerExists) {
                     throw new customError("Answer does not exist." , 400);
              } 
              const answerOwnerUser_id = await getUserIDFromAnswerId(answer_id);
              const ifanswerUserSame = await compareUsers(loggedinUserId , answerOwnerUser_id);
              if (!ifanswerUserSame) {
                     throw new customError("Unauthorized. You cannot delete the answer" , 400);
              }
              await executeQuery(deleteAnswerQuery(), [answer_id]);
              response_output = {"statusCode" : 200 , "Message" : "Answer deleted successfully" , "Data": null}
       } catch (error) {
              if (error.message === "JsonWebTokenError") {
                     response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
                     return;
              }
              response_output = {"statusCode" : 500 , "Message" : error.message , "Data": null}
       } finally {
              return send_response(res , response_output); 
       }
};

getAllAnswers = async (req , res) => {
       const {question_id} = req.body;
       try {
              const getAllAnswersQuery = () => {
                     return `SELECT * FROM answers where question_id = ?`;
              }
              const result = await executeQuery(getAllAnswersQuery() , [question_id]);
              response_output = {"statusCode" : 200 , "Message" : "Answers fetched successfully" , "Data": result}
       } catch (error) {
              response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
       } finally {
              return send_response(res , response_output); 
       }
       
}
getUserIDFromAnswerId = async (answer_id) => {
       const answerUserId = await executeQuery(checkAnswerIdQuery(), [answer_id]);
       return answerUserId[0].user_id;
}

compareUsers = async (loggedinUserId, questionOwnerUser_id) => {
       return loggedinUserId === questionOwnerUser_id;
}

answerExists = async (answer_id) => {
       const answerExists = await executeQuery(checkAnswerIdQuery(), [answer_id]);
       return answerExists.length == 1;
}

getUserIDFromAnswerId = async (answer_id) => {
       const answerUserId = await executeQuery(checkAnswerIdQuery(), [answer_id]);
       return answerUserId[0].user_id;
}

compareUsers = async (loggedinUserId, questionOwnerUser_id) => {
       return loggedinUserId === questionOwnerUser_id;
}

answerExists = async (answer_id) => {
       const answerExists = await executeQuery(checkAnswerIdQuery(), [answer_id]);
       return answerExists.length == 1;
}

getUserIDFromQuestionId = async (question_id) => {
       const questionUserId = await executeQuery(checkQuestionIdQuery(), [question_id]);
       return questionUserId[0].user_id;
}

compareUsers = async (loggedinUserId, questionOwnerUser_id) => {
       return loggedinUserId === questionOwnerUser_id;
}

questionExists = async (question_id) => {
       const questionExists = await executeQuery(checkQuestionIdQuery(), [question_id]);
       console.log(questionExists);
       return questionExists.length == 1;
}
     
module.exports = { createAnswer , updateAnswer , deleteAnswer , getAllAnswers}


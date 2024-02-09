const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { insertQuestionQuery } = require("../query.js");
const { executeQuery } = require("../../utils/db.js");
const { send_response } = require("../../utils/response.js");
const { checkQuestionIdQuery } = require("../query.js");
const { updateQuestionQuery } = require("../query.js");
const { deleteQuestionQuery } = require("../query.js");
const { customError } = require("../../utils/customError.js");

const SECRET_KEY = process.env.SECRET_KEY;

let response_output;

createQuestion = async (req, res) => {
       const { title , description } = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const question_id = uuidv4();
              await executeQuery(insertQuestionQuery(), [question_id , title , description , loggedinUserId]);
              response_output = {"statusCode" : 200 , "Message" : "Question Added successfully" , "Data": {"Title" : title , "Description" : description}}
       } catch (error) {
              if (error.message === "JsonWebTokenError") {
                     response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
                     return;
              }
              response_output = {"statusCode" : 500 , "Message" : error.message , "Data": null}
       } finally {
              await send_response(res, response_output);
       }
};

updateQuestion = async (req, res) => {
       const {question_id , title , description } = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const questionOwnerUser_id = await getUserIDFromQuestionId(question_id);
              const ifquestionUserSame = await compareUsers(loggedinUserId , questionOwnerUser_id);
              if (!ifquestionUserSame) {
                     throw new customError("Unauthorized. You cannot update the Question." , 400);
              }
              await executeQuery(updateQuestionQuery(), [title , description , question_id]);
              response_output = {"statusCode" : 200 , "Message" : "Question updated successfully" , "Data": {"Title" : title , "Description" : description}}
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


deleteQuestion = async (req, res) => {
       const {question_id} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifquestionExists = await questionExists(question_id);
              if (!ifquestionExists) {
                     throw new customError("Question does not exist." , 400);
              } 
              const questionOwnerUser_id = await getUserIDFromQuestionId(question_id);
              const ifquestionUserSame = await compareUsers(loggedinUserId , questionOwnerUser_id);
              if (!ifquestionUserSame) {
                     throw new customError("Unauthorized. You cannot delete the Question." , 400);
              }
              await executeQuery(deleteQuestionQuery(), [question_id]);
              response_output = {"statusCode" : 200 , "Message" : "Question deleted successfully" , "Data": null}
       } catch (error) {
              if (error.message === "JsonWebTokenError") {
                     response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
                     return;
              }
              response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
       } finally {
              return send_response(res , response_output); 
       }
};

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

getUserIDFromQuestionId = async (question_id) => {
       const questionUserId = await executeQuery(checkQuestionIdQuery(), [question_id]);
       return questionUserId[0].user_id;
}

compareUsers = async (loggedinUserId, questionOwnerUser_id) => {
       return loggedinUserId === questionOwnerUser_id;
}

module.exports = { createQuestion , updateQuestion , deleteQuestion }

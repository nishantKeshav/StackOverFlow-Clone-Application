const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { checkAnswerIdQuery } = require("../query.js");
const { insertCommentQuery } = require("../query.js");
const { executeQuery } = require("../../utils/db.js");
const { send_response } = require("../../utils/response.js");
const { checkCommentIdQuery } = require("../query.js");
const { updateCommentQuery } = require("../query.js");
const { checkCommentIdQuery } = require("../query.js");
const { deleteCommentQuery } = require("../query.js");
const { customError } = require("../../utils/customError.js");

const SECRET_KEY = process.env.SECRET_KEY;

let response_output;


createComment = async (req, res) => {
       const {answer_id , content} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const commentId = uuidv4();
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifanswerExists = await answerExists(answer_id);
              if (!ifanswerExists) {
                     throw new customError("Answer does not exist." , 400);
              }
              await executeQuery(insertCommentQuery(), [commentId , content , answer_id , loggedinUserId]);
              response_output = {"statusCode" : 200 , "Message" : "Comment added successfully" , "Data": {"Content" : content}}
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

updateComment = async (req, res) => {
       const {comment_id , content} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifcommentExists = await commentExists(comment_id);
              if (!ifcommentExists) {
                     throw new customError("Comment does not exist." , 400);
              }
              const commentOwnerUser_id = await getUserIDFromCommentId(comment_id);
              const ifcommentUserSame = await compareUsers(loggedinUserId , commentOwnerUser_id);
              if (!ifcommentUserSame) {
                     throw new customError("Unauthorized. You cannot update the comment" , 400);
              }
              await executeQuery(updateCommentQuery(), [content , comment_id]);
              response_output = {"statusCode" : 200 , "Message" : "Comment updated successfully" , "Data": {"Content" : content}}
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

deleteComment = async (req, res) => {
       const {comment_id} = req.body;
       try {
              const token = req.headers.authorization.split(" ")[1];
              if (!token) {
                     throw new customError("Unauthorized. Token missing." , 400);
              }
              const decodedToken = jwt.verify(token, SECRET_KEY);
              const loggedinUserId = decodedToken.user_id;
              const ifcommentExists = await commentExists(comment_id);
              if (!ifcommentExists) {
                     throw new customError("Comment does not exist." , 400);
              }
              const commentOwnerUser_id = await getUserIDFromCommentId(comment_id);
              const ifcommentUserSame = await compareUsers(loggedinUserId , commentOwnerUser_id);
              if (!ifcommentUserSame) {
                     throw new customError("Unauthorized. You cannot delete the comment" , 400);
              }
              await executeQuery(deleteCommentQuery(), [comment_id]);
              response_output = {"statusCode" : 200 , "Message" : "Comment deleted successfully" , "Data": null}
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


commentExists = async (comment_id) => {
       const commentExists = await executeQuery(checkCommentIdQuery(), [comment_id]);
       return commentExists.length == 1;
}

getUserIDFromCommentId = async (comment_id) => {
       const commentUserId = await executeQuery(checkCommentIdQuery(), [comment_id]);
       return commentUserId[0].user_id;
}

compareUsers = async (loggedinUserId, commentOwnerUser_id) => {
       return loggedinUserId === commentOwnerUser_id;
}


commentExists = async (comment_id) => {
       const commentExists = await executeQuery(checkCommentIdQuery(), [comment_id]);
       return commentExists.length == 1;
}

getUserIDFromCommentId = async (comment_id) => {
       const commentUserId = await executeQuery(checkCommentIdQuery(), [comment_id]);
       return commentUserId[0].user_id;
}

compareUsers = async (loggedinUserId, commentOwnerUser_id) => {
       return loggedinUserId === commentOwnerUser_id;
}

answerExists = async (answer_id) => {
       const answerExists = await executeQuery(checkAnswerIdQuery(), [answer_id]);
       return answerExists.length == 1;
}

module.exports = { createComment, updateComment, deleteComment };


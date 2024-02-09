const joi = require("joi")

const {send_response} = require("../response")

const createCommentSchema = joi.object({
       answer_id: joi.string().required().min(1).max(255),
       content: joi.string().required().min(1).max(255),
});


const updateCommentSchema = joi.object({
       comment_id: joi.string().required().min(1).max(255),
       content: joi.string().required().min(1).max(255),
});

const deleteCommentSchema = joi.object({
       comment_id: joi.string().required().min(1).max(255),
});

let response_output;
async function createCommentValidation(req, res, next) {
  try {
    await createCommentSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
    next()
  } catch (error) {
    response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
  } finally {
       await send_response(res, response_output);
  }
}

async function updateCommentValidation(req, res, next) {
       try {
         await updateCommentSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
         next()
       } catch (error) {
         response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
       } finally {
            await send_response(res, response_output);
       }
}

async function deleteCommentValidation(req, res, next) {
       try {
         await deleteCommentSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
         next()
       } catch (error) {
         response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
       } finally {
            await send_response(res, response_output);
       }
}

module.exports = { createCommentValidation , updateCommentValidation , deleteCommentValidation }
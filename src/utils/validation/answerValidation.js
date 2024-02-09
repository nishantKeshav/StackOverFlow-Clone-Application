const joi = require("joi")

const {send_response} = require("../response")

const createAnswerSchema = joi.object({
       question_id: joi.string().required().min(1).max(255),
       content: joi.string().required().min(1).max(255),
});


const updateAnswerSchema = joi.object({
       answer_id: joi.string().required().min(1).max(255),
       content: joi.string().required().min(1).max(255),
});

const deleteAnswerSchema = joi.object({
       answer_id: joi.string().required().min(1).max(255),
});

let response_output;
async function createAnswerValidation(req, res, next) {
  try {
    await createAnswerSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
    next()
  } catch (error) {
    response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
  } finally {
       await send_response(res, response_output);
  }
}

async function updateAnswerValidation(req, res, next) {
       try {
         await updateAnswerSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
         next()
       } catch (error) {
         response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
       } finally {
            await send_response(res, response_output);
       }
}

async function deleteAnswerValidation(req, res, next) {
       try {
         await deleteAnswerSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
         next()
       } catch (error) {
         response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
       } finally {
            await send_response(res, response_output);
       }
}

module.exports = { createAnswerValidation , updateAnswerValidation , deleteAnswerValidation }
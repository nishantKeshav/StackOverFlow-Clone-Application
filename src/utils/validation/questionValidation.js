const joi = require("joi")

const {send_response} = require("../response")

const createQuestionSchema = joi.object({
       title: joi.string().required().min(1).max(255),
       description: joi.string().required().min(1).max(255),
});


const updateQuestionSchema = joi.object({
       question_id: joi.string().required().min(1).max(255),
       title: joi.string().required().min(1).max(255),
       description: joi.string().required().min(1).max(255),
});

const deleteQuestionSchema = joi.object({
       question_id: joi.string().required().min(1).max(255),
});

let response_output;
async function createQuestionValidation(req, res, next) {
  try {
    await createQuestionSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
    next()
  } catch (error) {
    response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
  } finally {
       await send_response(res, response_output);
  }
}

async function updateQuestionValidation(req, res, next) {
       try {
         await updateQuestionSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
         next()
       } catch (error) {
         response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
       } finally {
            await send_response(res, response_output);
       }
}

async function deleteQuestionValidation(req, res, next) {
       try {
         await deleteQuestionSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
         next()
       } catch (error) {
         response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
       } finally {
            await send_response(res, response_output);
       }
}

module.exports = { createQuestionValidation , updateQuestionValidation , deleteQuestionValidation }
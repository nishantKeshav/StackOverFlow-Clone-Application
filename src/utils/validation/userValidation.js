const joi = require("joi")

const {send_response} = require("../response")

const userLoginSchema = joi.object({
  username: joi.string().required().min(1).max(255),
  password: joi.string().required().min(1).max(255),
})

let response_output;
async function loginValidation(req, res, next) {
  try {
    await userLoginSchema.validateAsync(req.body.loginDetails, {abortEarly: false,})
    next()
  } catch (error) {
    response_output = {"statusCode" : error.errorCode , "Message" : "User Details Validation Failed" , "Data": null};
  } finally {
       await send_response(res, response_output);
  }
}

module.exports = {loginValidation}
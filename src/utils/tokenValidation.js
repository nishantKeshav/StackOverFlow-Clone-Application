const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken")

const {send_response} = require("../utils/response")

let response_output;

async function validateToken(req, res, next) {
       try {
              if (!req.headers.authorization) {
                     throw new customError("No Bearer Token Found" , 400);
              }
              let decoded = jwt.verify(req.headers.authorization.slice(7), process.env.SECRET_KEY);
              req.username = decoded;
              next();
       } catch (error) {
              response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null};
       } finally {
              await send_response(res , response_output);
       }
}

module.exports = {validateToken}

const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const { checkUserQuery } = require("../users/query.js");
const { executeQuery } = require("../utils/db.js");
const { insertUserQuery } = require("../users/query.js")
const { send_response } = require("../utils/response.js");
const { customError } = require("../utils/customError.js");
const { uuid } = require('uuidv4');

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRATION = "1d";

let response_output;


userRegister = async (req, res) => {
       const { username , password } = req.body;
       const user_id = uuid();
       // console.log(user_id);
       try {
         if (!username || !password) {
           throw new customError("Username and password are required" , 400);
         }
         const ifuserExists = await userExists(username);
         if (ifuserExists) {
           throw new customError("Username already exists" , 400);
         }
         console.log(username , password);
         await executeQuery(insertUserQuery(), [user_id , username  , password]);
         response_output = {"statusCode" : 200 , "Message" : "User Registered successfully" , "Data": {"UserName" : username}}
       } catch (error) {
              console.log("error" ,  error);
         response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null};
       } finally {
         await send_response(res , response_output);
       }
};

userLogin = async (req, res) => {
       const { username, password} = req.body;
       if (!username || !password) {
              throw new customError("Username and password are required" , 400);
       }
       try {
              const user = await executeQuery(checkUserQuery(), [username]);
              const ifuserExists = await userExists(username);
              if (!ifuserExists) {
                     throw new customError("Username does not exist" , 404);
              }
              const user_id = user[0].user_id;
              const userPassword = user[0].password;
              const ifPasswordMatch = await passwordMatch(userPassword , password);
              if (!ifPasswordMatch) {
                     throw new customError("Password does not match" , 400);
              }
              const token = await generateToken(username , user_id);
              console.log(token);
              response_output = {"statusCode" : 200 , "Message" : "User Logged In successfully" , "Data": {"UserName" : username ,"Token" : token}}
       } catch (error) {
              
              response_output = {"statusCode" : error.errorCode , "Message" : error.message , "Data": null}
       } finally {
              await send_response(res, response_output);
       }
};

userExists = async (username) => {
  const ifuserExists = await executeQuery(checkUserQuery(), [username]);
  return ifuserExists.length == 1;
}

passwordMatch = async (userPassword, password) => {
  return userPassword === password;
}

generateToken = async (username , user_id) => {
       const user = {
              username : username,
              user_id : user_id
       }
       const token = jwt.sign( user, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
       return token;
}

module.exports = { userRegister , userLogin }
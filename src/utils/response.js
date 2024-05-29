const send_response = async (res , response_output) => {

       const statusCode = response_output.statusCode;
       res.status(statusCode).json(response_output);
}
   
module.exports = {send_response}
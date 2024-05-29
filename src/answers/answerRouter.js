const express = require('express');
const router  = express.Router();

const { createAnswer , updateAnswer , deleteAnswer , getAllAnswers } = require('../answers/controller');
const { validateToken } = require('../utils/tokenValidation');
// const { createAnswerValidation , updateAnswerValidation , deleteAnswerValidation } = require('../utils/validation/answerValidation');

router.put('/insertAnswer' , createAnswer);
router.patch('/updateAnswer' ,  validateToken , updateAnswer);
router.delete('/deleteAnswer' , validateToken ,  deleteAnswer);
router.post('/getAnswers' , getAllAnswers)

module.exports = router;
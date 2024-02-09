const express = require('express');
const router  = express.Router();

const { createAnswer , updateAnswer , deleteAnswer } = require('./controller');
const { validateToken } = require('../utils/tokenValidation');
const { createAnswerValidation , updateAnswerValidation , deleteAnswerValidation } = require('../utils/validation/answerValidation');

router.put('/insertAnswer' , createAnswerValidation, validateToken ,   createAnswer);
router.patch('/updateAnswer' , updateAnswerValidation , validateToken , updateAnswer);
router.delete('/deleteAnswer' , deleteAnswerValidation , validateToken ,  deleteAnswer);

module.exports = router;
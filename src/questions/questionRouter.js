const express = require('express');
const router  = express.Router();

const { createQuestion , updateQuestion , deleteQuestion } = require('./controller');
const { validateToken } = require('../utils/tokenValidation');
const { createQuestionValidation , updateQuestionValidation , deleteQuestionValidation } = require('../utils/validation/questionValidation');

router.put('/insertQuestion' , createQuestionValidation , validateToken , createQuestion);
router.patch('/updateQuestion' , updateQuestionValidation , validateToken , updateQuestion);
router.delete('/deleteQuestion' , deleteQuestionValidation , validateToken , deleteQuestion);
module.exports = router;
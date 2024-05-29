const express = require('express');
const router  = express.Router();

const { createQuestion , updateQuestion , deleteQuestion , getAllQuestion } = require('../questions/controller');
const { validateToken } = require('../utils/tokenValidation');
// const { createQuestionValidation , updateQuestionValidation , deleteQuestionValidation } = require('../utils/validation/questionValidation');

router.put('/insertQuestion', createQuestion);
router.patch('/updateQuestion' , updateQuestion);
router.delete('/deleteQuestion' , validateToken , deleteQuestion);
router.post('/getAllQuestion' , getAllQuestion);
module.exports = router;
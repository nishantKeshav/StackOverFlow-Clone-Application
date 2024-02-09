const express = require('express');
const router  = express.Router();

const { createComment , updateComment , deleteComment } = require('./controller');
const { validateToken } = require('../utils/tokenValidation');
const { createCommentValidation , updateCommentValidation , deleteCommentValidation } = require('../utils/validation/commentValidation');

router.put('/insertComment' , createCommentValidation, validateToken , createComment);
router.patch('/updateComment' , updateCommentValidation, validateToken , updateComment);
router.delete('/deleteComment' , deleteCommentValidation, validateToken , deleteComment);


module.exports = router;
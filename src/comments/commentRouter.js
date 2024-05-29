const express = require('express');
const router  = express.Router();

const { createComment , updateComment , deleteComment , getAllComments } = require('../comments/controller');
const { validateToken } = require('../utils/tokenValidation');
// const { createCommentValidation , updateCommentValidation , deleteCommentValidation } = require('../utils/validation/commentValidation');

router.put('/insertComment' , createComment);
router.patch('/updateComment' ,validateToken , updateComment);
router.delete('/deleteComment' ,validateToken , deleteComment);
router.post('/getComments' , getAllComments)


module.exports = router;
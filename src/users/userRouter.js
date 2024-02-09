const express = require('express');
const router  = express.Router();

const { userRegister , userLogin } = require('./controller');
const { loginValidation } = require('../utils/validation/userValidation');

router.put('/register' , loginValidation , userRegister);
router.post('/login' ,  loginValidation , userLogin);
module.exports = router;
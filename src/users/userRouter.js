const express = require('express');
const router  = express.Router();

const { userRegister , userLogin } = require('../users/controller');
// const { loginValidation } = require('../utils/validation/userValidation');

router.put('/register' ,userRegister);
router.post('/login' , userLogin);
module.exports = router;
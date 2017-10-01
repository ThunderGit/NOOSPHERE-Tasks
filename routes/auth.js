var express = require('express');
var router = express.Router();

var controller=require('../controllers/auth_controller.js');

//auth

router.get('/', controller.index);
router.post('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;

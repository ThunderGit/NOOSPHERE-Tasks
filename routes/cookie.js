var express = require('express');
var router = express.Router();

var controller=require('../controllers/cookie_controller.js');

router.get('/', controller.index);

module.exports = router;

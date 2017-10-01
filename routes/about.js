var express = require('express');
var router = express.Router();

var controller=require('../controllers/about_controller.js');
/* GET users listing. */
router.get('/', controller.index);

module.exports = router;

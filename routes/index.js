var express = require('express');
var router = express.Router();

var indexController=require('../controllers/index_controller.js');

// function checkAuth(req,res,next){
// 	if(req.session.isLoggedIn){
// 		return next();
// 	}else{
// 		res.status(401);
// 		res.redirect('auth');
// 	}
// }
/* GET users listing. */

router.get('/', indexController.index);
router.post('/', indexController.save);
router.post('/auth', indexController.save);
module.exports = router;

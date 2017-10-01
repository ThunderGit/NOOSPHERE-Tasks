module.exports={

	index:function(req,res,next){
        res.render("../views/login.ejs",{req:req}); 
	},

	login: function(req,res,next){
		// if(req.body.name==="james"||req.body.pass==="bond"){

		// 	req.session.isLoggedIn=true;
		// 	res.redirect(301,'/users');
			
		// }else{
		// 	res.redirect(301,'/');
		// }
		//res.render('index');
		req.session.isLoggedIn=true;
		console.log("req.session.isLoggedIn: "+req.session.isLoggedIn);
		res.redirect(301,'/');
	},

	logout:function(req,res,next){
		req.session.destroy(function(err){

			res.redirect(301,'/login');
		});
	}

};
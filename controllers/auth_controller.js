var fs = require('fs');
var path = require('path');

var fileName="../public/Users.json";

module.exports={

	index:function(req,res,next){
        res.render("../views/auth.ejs",{req:req}); 
	},

	login: function(req,res,next){
		
		fs.readFile(fileName, (err, result) => {
              if (err) { console.log(err); }

              let obj = JSON.parse(result); // То что нужно

    
              obj.push({Name: req.body.name, Login:req.body.login,Password:req.body.pass}); 
              var jayson = JSON.stringify(obj); 
       

              fs.writeFile(fileName, jayson+"\n",'utf8', function readFileCallback(err, data){
                    if (err){
                      console.log(err);
                      } 
                    else 
                    {
                      console.log("User Saved!");
                    }
              });
    
            });
		// req.session.isLoggedIn=true;
		// console.log("req.session.isLoggedIn: "+req.session.isLoggedIn);
		// res.redirect(301,'/');
	},

	logout:function(req,res,next){
		req.session.destroy(function(err){

			res.redirect(301,'/auth');
		});
	}

};
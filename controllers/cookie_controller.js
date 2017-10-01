module.exports={

	index:function(req,res,next){
           
          if(!req.session.view){

          	req.session.view=0;
          }
           req.session.view++;
    	    

           res.render("../views/cookies.ejs",{req:req});
	}

};
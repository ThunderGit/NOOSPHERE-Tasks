var fs = require('fs');
var path = require('path');

var fileName="../public/Results1.json";
var fileNameRec="../public/ResultsREC.txt";

function Controller(){}

let getTop10=function(done) { // Получить Топ-10 результатов

   fs.readFile(fileName, (err, result) => {
    if (err) {
      console.log(err);
    }

    let jsObj = JSON.parse(result);

    var sortPoints = [];
    var sortNames=[];
    for(var i=0;i<jsObj.length ;i++)
    {
        sortPoints.push(parseInt(jsObj[i].Points));
        sortNames.push(jsObj[i].PlayerName);
    }
    for(var i=0;i<sortPoints.length;i++)
    {
        for(var j=0;j<sortPoints.length-1;j++)
        {
          if(sortPoints[j]<sortPoints[j+1]){

            var temp=sortPoints[j];
            sortPoints[j]=sortPoints[j+1];
            sortPoints[j+1]=temp;

            temp=sortNames[j];
            sortNames[j]=sortNames[j+1];
            sortNames[j+1]=temp;
          }
        }
    }
    var recList;
    var size=10;
    if(size>sortPoints.length) {
        size=sortPoints.length;
    }
    for(var i=0;i<10 ;i++)
    {
           recList+=sortNames[i]+": "+sortPoints[i]+"<br>\n";
    }
    recList=recList.substring(9);
    console.log(recList);
     fs.writeFile(fileNameRec, recList,'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                console.log("Records File Saved!");
            }
        }); 
     return done(null,recList);
  });

};

 Controller.index=function(req,res,next){  // Индекс
  res.render('index');
 };

 Controller.save=function(req, res, next) { // Сохранить результат
  console.log("POST = "+req.body);

  let data={};

    try{ 
          data = JSON.parse(req.body);
          //res.statusCode=201;
     
          fs.readFile(fileName, (err, result) => {
              if (err) { console.log(err); }

              let obj = JSON.parse(result); // То что нужно

    
              obj.push({PlayerName: req.body.name, Points:req.body.pts}); 
              var jayson = JSON.stringify(obj); 
       

              fs.writeFile(fileName, jayson+"\n",'utf8', function readFileCallback(err, data){
                    if (err){
                      console.log(err);
                      } 
                    else 
                    {
                      console.log("File Saved!");

                      getTop10(function(err,recList){
                          if (err) { console.log(err); }
                          console.log(recList);
                          console.log("Resorted");
                      });
                    }
              });
    
            });
        } 
        catch(e){
            res.statusCode=400;
            }
  res.status(201).send;
};
module.exports=Controller;
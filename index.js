const http=require("http");
const fs=require("fs");
var path = require('path');
var fileName="./Results1.json";
var fileNameRec="./ResultsREC.txt";

const server=http.createServer();

const types={
	'.js':{contentType:'text/javascript'},
	'.css':{contentType:'text/css'},
	'.html':{contentType:'text/html'},
	'.jpg':{contentType:'image/jpg'},
	'.png':{contentType:'image/png'},
	default:{contentType:'text/html'}
};
server.on('request',(request,response)=> {

const {method,url,headers} = request;

if(method==='POST'){
	let postData="";
	request.on('data',data=>{
        postData+=data;
	});
	request.on('end',()=>{
		processPost(request,response,postData);
	});
}else{
	processGet(request,response);
}

function processPost(request,response,postData){
	let data={};
	try{ 
      data = JSON.parse(postData);
      response.statusCode=201;
     
      fs.readFile("./Results1.json", (err, result) => {
    if (err) {
      console.log(err);
    }

    
    let obj = JSON.parse(result); // То что нужно
    obj.push({PlayerName: data.name, Points:data.pts}); 
       var jayson = JSON.stringify(obj); 
       
    fs.writeFile(fileName, jayson+"\n",'utf8', function readFileCallback(err, data){
         if (err){
            console.log(err);
          } else {
        console.log("File Saved!");
      }
    });
    
  });
      
       
     } catch(e){
        response.statusCode=400;
      }
	console.log("\nPOST = ", data.name,data.pts);
	
	response.end();
}

function getTop10() {

  fs.readFile("./Results1.json", (err, result) => {
    if (err) {
      console.log(err);
    }

    //result=sortAndProcess(result,"Points");
    let data = JSON.parse(result); // То что нужно
    //data=JSON.stringify(data);
    //data=JSON.parse(data);
    data = sortAndProcess(data); // sort, find, etc...
    //console.log(data);
    
  });

}

function sortAndProcess(jsObj){
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
	var recList;;
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
        		console.log("File Saved!");
      		}
    	});	

}

// function escapeSpecialChars(jsonString) {

//             return jsonString.replace(/\n/g, "\\n")
//                 .replace(/\r/g, "\\r")
//                 .replace(/\t/g, "\\t")
//                 .replace(/\f/g, "\\f");

// }

function processGet(request,response){
//console.log('Request= ${method},${url}');
// console.log(headers);
	let url = request.url;
	let fileExt = path.extname(url);

	  if(url=="/Results1.json"){
		getTop10((err, top10data) => {
			  if (err) {
				  console.log('Error happened!');
			  } else {

				  console.log('Top 10 results:', top10data);
			  
			      response.write(top10Data.toString());
			      response.end();
			  }
	 	});
	  }
	else{
	    let responseParams=types[fileExt]||types.default;


	    response.setHeader("Content-Type",responseParams.contentType);


	    let filepath="."+url;
		if(filepath==="./"){

			filepath="./public/RemoveBlocks/index.html";
		}

	    console.log(filepath);

		let readStream=fs.createReadStream(filepath);
		readStream.pipe(response);
        readStream.on('error', function() {
            response.statusCode = 404;
			response.end();
        });
	}

}
//response.end();
});

server.listen(8080);

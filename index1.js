const http=require("http");
const fs=require("fs");
var path = require('path');

const server=http.createServer();

const types={
	'.js':{contentType:'text/javascript'},
	'.css':{contentType:'text/css'},
	'.html':{contentType:'text/html'},
	'.jpg':{contentType:'image/jpg'},
	'.png':{contentType:'image/png'},
	default:{contentType:'text/html'}
};
server.on('request',(request,response)=>{

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
      var fileName="E:/Andrew/NODEHTTP/Results.txt";
      var fileName1="E:/Andrew/NODEHTTP/Results1.json";
     
      var obj= {table: []};
      
       obj.table.push({PlayerName: data.name, Points:data.pts}); 
       var jayson = JSON.stringify(obj); 
        
        getTop10((err, top10data) => {
  if (err) {
	  console.log('Error happened!');
  } else {
	  console.log('Top 10 results:', top10data);
  }
});
    //    fs.readFile(fileName1, 'utf8', function readFileCallback(err, d){
    // if (err){
    //     console.log(err);
    // } else {
    // var obj1 = JSON.parse(escapeSpecialChars(d)); //now it an object
    // console.log(escapeSpecialChars(obj1));
    // }});

    fs.appendFile(fileName1, jayson+"\n",'utf8', function readFileCallback(err, data){
         if (err){
            console.log(err);
          } else {
        console.log("File Saved!");
      }
    });
     } catch(e){
        response.statusCode=400;
      }
	console.log("\nPOST = ", data.name,data.pts);
	
	response.end();
}

function getTop10(done) {

  fs.readFile("E:/Andrew/NODEHTTP/Results1.json", (err, result) => {
    if (err) {
      return done(err);
    }
    result=sortAndprocess(result,result.table);
    let data = JSON.stringify(result);
    //data = sortAndProcess(data,"Points"); // sort, find, etc...
    done(null,  data);
  });

}
function sortAndProcess(data,key){
  return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function escapeSpecialChars(jsonString) {

            return jsonString.replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f");

 }
function processGet(request,response){
console.log('Request= ${method},${url}');
// console.log(headers);

let fileExt = path.extname(url);

let responseParams=types[fileExt]||types.default;


response.setHeader("Content-Type",responseParams.contentType);


let filepath="."+url;
if(filepath==="./")
{
	filepath="./public/RemoveBlocks/index.html";
}

console.log(filepath);

let readStream=fs.createReadStream(filepath);
readStream.pipe(response);
}

//response.end();
});

server.listen(8080);




//response.write("Hello");
// if(url!=="/"){
  
//     response.statusCode=404;
//     response.statusMessage="Not Found";
//  } else{
//  	response.write("<h1>UA:"+headers["user-agent"]+"</h1>");
//  }


// let res={
// 	a:1234,
// 	b:"abc"
// };
// response.write(JSON.stringify(res));
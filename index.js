var http = require('http');
var fs = require('fs');
var path = require('path');
var fileName="E:/Andrew/NODEHTTP/Results1.json";


const types={
	'.js':{contentType:'text/javascript'},
	'.css':{contentType:'text/css'},
	'.html':{contentType:'text/html'},
	'.jpg':{contentType:'image/jpg'},
	'.png':{contentType:'image/png'},
	default:{contentType:'text/html'}
};

http.createServer(function (request, response) {

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
     
     
     
      //var obj= [{table: []}];
      
       //obj.table.push({PlayerName: data.name, Points:data.pts}); 
       var jayson = JSON.stringify({PlayerName: data.name, Points:data.pts}); 
        

    fs.appendFile(fileName, jayson+"\n",'utf8', function readFileCallback(err, data){
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

  fs.readFile(fileName, (err, result) => {
    if (err) {
      return done(err);
    }
    let data = escapeSpecialChars(JSON.stringify(result));
    data=JSON.parse(data);
    //data=sortAndProcess(data,"Points");
    console.log("Success");
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
//console.log(request.url+"\n");

var filePath = '.' + request.url;

if (filePath == './'||filePath == './public/RemoveBlocks/index.html?')
    filePath = './public/RemoveBlocks/index.html';

if(filePath=='./public/RemoveBlocks/About.html?')
    filePath = './public/RemoveBlocks/About.html';

let fileExt = path.extname(request.url);

let responseParams=types[fileExt]||types.default;

response.setHeader("Content-Type",responseParams.contentType);

fs.readFile(filePath, function(error, content) {
    if (error) {
        if(error.code == 'ENOENT'){
           response.writeHead(400);
            response.end('<h1>ERROR 404</h1>\n <p>Page Not Found</p>\n');
            response.end();
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error\n');
            response.end(); 
        }
    }
    else {
        response.writeHead(200, { 'Content-Type': responseParams.contentType });
        response.end(content, 'utf-8');
    }
});

getTop10((err, top10data) => {
  if (err) {
      console.log('Error happened!');
  } else {
      console.log('Top 10 results:', top10data);
      //var rec=document.getElementById("record");
      //rec.innerHTML=top10data;
  }
});

}

}).listen(8080);

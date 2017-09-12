var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
console.log(request.url+"\n");

var filePath = '.' + request.url;

if (filePath == './'||filePath == './public/RemoveBlocks/index.html')
    filePath = './public/RemoveBlocks/index.html';

if(filePath=='./public/RemoveBlocks/About.html?')
    filePath = './public/RemoveBlocks/About.html';

var extname = path.extname(filePath);
var contentType = 'text/html';
switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.json':
        contentType = 'application/json';
        break;
    case '.png':
        contentType = 'image/png';
        break;      
    case '.jpg':
        contentType = 'image/jpg';
        break;
    case '.wav':
        contentType = 'audio/wav';
        break;
}

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
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    }
});

}).listen(8080);
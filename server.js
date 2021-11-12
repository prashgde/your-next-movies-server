// Schedule running top100.js
// Read top100.json
// Send top100.json

const movies = require('./top100/top100.json');
const http = require('http');
require('dotenv').config();

const port = process.env.PORT;

const top100MoviesUrl = '/api/top100';

const server = http.createServer((request, response) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Max-Age": 2592000, // 30 days
        "Content-Type": "application/json"
        /** add other headers as per requirement */
    };
    
    if(request.url === top100MoviesUrl && request.method === 'GET') {
        response.writeHead(200, headers);
        response.write(JSON.stringify(movies));
        response.end();
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

server.listen(port);


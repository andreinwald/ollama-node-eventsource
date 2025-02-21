const http = require('node:http');
const url = require('url');
import ollama from 'ollama'

const message = {role: 'user', content: 'Why is the sky blue?'}
const response = await ollama.chat(
    {model: 'deepseek-r1:32b', messages: [message], stream: true}
)
for await (const part of response) {
    process.stdout.write(part.message.content)
}

function handleRequest(request, response) {
    let parsedUrl = url.parse(request.url)
    switch (parsedUrl.pathname) {
        case '/send_message': {
            routeMessage(request, response);
            break;
        }
        case '/response_stream': {
            routeResponseStream(request, response);
            break;
        }
        default: {
            response.statusCode = 404;
            response.end();
        }
    }
}

let responseStream;

function routeMessage(request, response) {
    responseStream.write(`test`);
    response.end();
}

function routeResponseStream(request, response) {
    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("connection", "keep-alive");
    response.setHeader("Content-Type", "text/event-stream");
    responseStream = response;
}

http.createServer(handleRequest)
    .listen(3000, '127.0.0.1', () => console.log('Listening 127.0.0.1:3000'));

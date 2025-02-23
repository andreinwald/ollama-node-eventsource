import http from 'node:http';
import url from 'url';
import ollama from 'ollama'

const model = 'llama3.2:1b';
await ollama.pull({model});

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

function routeMessage(request, response) {
    // responseStream.write(`test`);
    // response.end();
}

function routeResponseStream(request, response) {
    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("connection", "keep-alive");
    response.setHeader("Content-Type", "text/event-stream");
    chat('Why is the sky blue?', response);
}

async function chat(question, responseStream) {
    const message = {role: 'user', content: question}
    const response = await ollama.chat(
        {model, messages: [message], stream: true}
    )
    for await (const part of response) {
        responseStream.write('data: ' + part.message.content + '\n\n');
    }
}

http.createServer(handleRequest)
    .listen(3000, '127.0.0.1', () => console.log('Listening 127.0.0.1:3000'));

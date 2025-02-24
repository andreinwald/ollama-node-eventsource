import ollama from 'ollama'
import Express, {json} from 'express';
import cors from 'cors';

const model = 'llama3.2:1b';
await ollama.pull({model});

const app = Express();
app.use(cors());
app.use(json());

/** @type Response */
let streamResponse;

let messages = [];

function writeToEventSource(message) {
    streamResponse.write(`data: ${message}\n\n`);
}

app.get('/response_stream', async (request, response) => {
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("connection", "keep-alive");
    response.setHeader("Content-Type", "text/event-stream");
    streamResponse = response;
});

app.post('/send_message', async (request, response) => {
    response.end();
    ollama.abort();
    const question = String(request.body.message);
    if (question.length < 3) {
        writeToEventSource('question is empty');
    }
    messages.push({role: 'user', content: question});
    const chatRequest = {
        model, messages, stream: true,
    };
    const chatResponse = await ollama.chat(chatRequest);
    const savedResponse = {role: 'assistant', content: ''};
    messages.push(savedResponse);
    for await (const part of chatResponse) {
        savedResponse.content += part.message.content;
        writeToEventSource(part.message.content);
    }
});

app.get('/stop', async (request, response) => {
    ollama.abort();
    response.end();
});

app.listen(3000, () => {
    console.log('Listening 127.0.0.1:3000');
})
import ollama from 'ollama'
import Express, {json} from 'express';
import cors from 'cors';

const model = 'llama3.2:1b';
await ollama.pull({model});

const app = Express();
app.use(cors());
app.use(json());

let streamResponses = {};
let messageHistory = {};

app.get('/response_stream', async (request, response) => {
    const userToken = request.query.user_token;
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("connection", "keep-alive");
    response.setHeader("Content-Type", "text/event-stream");
    streamResponses[userToken] = response;
});

app.post('/send_message', async (request, response) => {
    response.end();
    ollama.abort();
    const question = String(request.body.message);
    const userToken = request.body.user_token;
    messageHistory.push({role: 'user', content: question});
    const chatRequest = {
        model, messages: messageHistory, stream: true,
    };
    const chatResponse = await ollama.chat(chatRequest);
    // object responseToUpdate will be updated after push
    const responseToUpdate = {role: 'assistant', content: ''};
    messageHistory[userToken].push(responseToUpdate);
    for await (const part of chatResponse) {
        responseToUpdate.content += part.message.content;
        streamResponses[userToken].write(`data: ${part.message.content}\n\n`);
    }
});

app.get('/stop', async (request, response) => {
    ollama.abort();
    response.end();
});

app.listen(3000, () => {
    console.log('Listening 127.0.0.1:3000');
})
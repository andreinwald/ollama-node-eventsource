import ollama from 'ollama'
import Express, {json} from 'express';
import cors from 'cors';

const model = 'llama3.2:1b';
await ollama.pull({model});

const app = Express();
app.use(cors());
app.use(json());

let streamResponse;

app.get('/response_stream', async (request, response) => {
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("connection", "keep-alive");
    response.setHeader("Content-Type", "text/event-stream");
    streamResponse = response;
});

app.post('/send_message', async (request, response) => {
    response.end();
    ollama.abort();
    const question = request.body.message;
    const message = {role: 'user', content: question}
    const chatResponse = await ollama.chat(
        {model, messages: [message], stream: true}
    )
    for await (const part of chatResponse) {
        streamResponse.write('data: ' + part.message.content + '\n\n');
    }
});

app.listen(3000, () => {
    console.log('Listening 127.0.0.1:3000');
})
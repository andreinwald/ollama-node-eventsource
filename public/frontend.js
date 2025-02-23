const API_HOST = 'http://127.0.0.1:3000';

let userId = Math.round(Math.random() * 1000);
let contentElement = document.getElementById("content");

let connection = new EventSource(API_HOST + `/response_stream?user_id=${userId}`);
connection.onmessage = (event) => {
    contentElement.innerHTML += event.data;
};
connection.onerror = (event) => {
    console.log(event)
    connection.close();
}

document.getElementById("send").onclick = () => {
    contentElement.innerHTML = '';
    let message = document.getElementById("query").value;
    fetch(API_HOST + `/send_message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            message,
        }),
    });
};



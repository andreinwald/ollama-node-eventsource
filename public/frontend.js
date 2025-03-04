const API_HOST = 'http://127.0.0.1:3000';

function getUserToken() {
    let token = localStorage.getItem('user_token');
    if (token) {
        return token;
    }
    // better implement your own authorization, e.g. via JWT
    token = crypto.getRandomValues(new Uint32Array(8)).join('')
    localStorage.setItem('user_token', token);
    return token;
}

const userToken = getUserToken();

let contentElement = document.getElementById("content");

let connection = new EventSource(`${API_HOST}/response_stream?user_token=${userToken}`);
connection.onmessage = (event) => {
    contentElement.innerHTML += event.data;
};
connection.onerror = (event) => {
    console.log(event)
    connection.close();
}

const questionInput = document.getElementById("questionInput");

document.getElementById("messageForm").onsubmit = (event) => {
    event.preventDefault();
    let message = questionInput.value;
    questionInput.value = '';
    contentElement.innerHTML += `<div class="question">${message}</div>`;
    fetch(API_HOST + `/send_message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userToken,
            message,
        }),
    });
};

document.getElementById('stop').onclick = () => {
    fetch(`${API_HOST}/stop`);
};


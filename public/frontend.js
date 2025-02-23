let contentElement = document.getElementById("content");
let userId = Math.round(Math.random() * 1000);
let connection = new EventSource(`http://127.0.0.1:3000/response_stream?user_id=${userId}`);
connection.onmessage = (event) => {
    contentElement.innerHTML += event.data;
};
connection.onerror = (event) => {
    console.log(event)
    connection.close();
}
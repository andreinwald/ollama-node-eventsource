let contentElement = document.getElementById("content");
let userId = Math.round(Math.random() * 1000);
let connection = new EventSource(`http://127.0.0.1:3000/events?user_id=${userId}`);
connection.onmessage = (event) => {
    const {date} = JSON.parse(event.data);
    contentElement.innerHTML += date + '<br/>';
};
connection.onerror = (event) => {
    console.log(event)
    connection.close();
}
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

const socket = io('http://localhost:3002'); // Conecta para o servidor
const sendButton = document.getElementById('send-btn'); 
const messagesList = document.getElementById('messages');
sendButton.addEventListener('click', () => {
const message = "";
socket.emit('request_data', message); // Emite requisição para o servidor
});
socket.on('requested_data', (msg) => { // Captura o retorno do servidor
const listItem = document.createElement('li');
listItem.textContent = msg;
messagesList.appendChild(listItem);
});
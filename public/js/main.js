const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

//Join chatroom
socket.emit('joinRoom', { username, room })

//Get room users
socket.on('roomUsers', ({ room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on('message', message => {
    console.log(message)
    outPutMessage(message)

    //Scroll down automatically
    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', e => {
    e.preventDefault()

    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg)

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function outPutMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
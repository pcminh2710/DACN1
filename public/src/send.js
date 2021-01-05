const socket = io('/');

socket.emit('user-connected', idUser1)

socket.on('new-message', function(data) {
    console.log(data)
    appendMes(data.message, data.sender)
})

function appendMes(message, sender) {
    // const messageElement = document.createElement('div');
    // messageElement.innerText = message
    if (sender == idReceiver1) {
        $('#content').append(`<div class="left">
        <img src="assets/image/user.jpg">
        <div class="message">` + message + `</div></div>`)

        //hiển thị cuối
        var messageBody = document.querySelector('#mid');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    } else {
        $('#content').append(`<div class="right"><div class="message">` + message + `</div></div>`)
        var messageBody = document.querySelector('#mid');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }

}

//enter để gởi tin nhắn
function processKey(e) {
    var contentInput = document.getElementById('contentMessage')
    var contentchat = contentInput.value
    if (null == e)
        e = window.event;
    if (e.keyCode == 13 && contentchat.length != 0) {
        sendMessage()
        return false;
    }
}

//nhấn button send để gởi tin nhắn
const btnSend = () => {
    sendMessage()
}


//gởi tin nhắn
function sendMessage() {
    var idSender = idUser1;
    var idReceiver = idReceiver1;
    var contentInput = document.getElementById('contentMessage')
    var contentchat = contentInput.value
    socket.emit('send-mes', {
        sender: idSender,
        receiver: idReceiver,
        message: contentchat
    })
    contentInput.value = ''
    appendMes(contentchat)
}
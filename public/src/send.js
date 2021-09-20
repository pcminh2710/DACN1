const socket = io('/');

$(document).ready(function() {
    $('.user-image').append(`
    <img src="assets/image/` + imageUser + `" alt="">`)

    document.getElementById('imagereceiver').src = 'assets/image/' + imageReceiver
    document.getElementById('ImageReceiver').src = 'assets/image/' + imageReceiver

    displayChat(idReceiver1)
    conversation()
    imageShare(idReceiver1, idUser1)
})


function imageShare(idReceiver, idSender) {
    $('.gird').html('')
    $.ajax({
        url: "/imageShare",
        type: "POST",
        data: {
            idSender: idSender,
            idReceiver: idReceiver
        },
        success: function(arr) {
            $.each(arr, function(key, val) {
                $('.gird').append(`
                <img src="assets/image/` + val.image + `" />
                `)
            })
        }
    })
    console.log("OK")
}


socket.emit('user-connected', idUser1)


//socket nhận text
socket.on('new-message', function(data) {
    console.log(data)
    appendMes(data.message, data.sender, data.image)
    conversation()
})

//socket nhận image
socket.on('image', function(data) {
    appendImage(data.name, data.sender, data.imageuser)
    imageShare(idReceiver1, idUser1)
})


//nối tiếp chat
function appendMes(message, sender, image) {
    // const messageElement = document.createElement('div');
    // messageElement.innerText = message
    if (sender == idReceiver1) {
        $('#content').append(`<div class="left">
        <img src="assets/image/` + image + `">
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
        conversation()
        return false;
    }
    if (e.keyCode == 13 && $('img').hasClass('viewImage')) {
        saveImage()
        return false;
    }
}

var replaceTest = function(str) {
    return str.replace(/^.*(\\|\/|\:)/, '');
}

//nhấn button send để gởi tin nhắn
const btnSend = () => {
    var contentInput = document.getElementById('contentMessage')
    var contentchat = contentInput.value

    if ($('img').hasClass('viewImage')) {
        saveImage()
    }
    if (contentchat.length != 0) {
        sendMessage()
        conversation()
    }
}




//gởi tin nhắn lên server và socket gởi tin nhắn
function sendMessage() {
    var idSender = idUser1;
    var idReceiver = idReceiver1;
    var contentInput = document.getElementById('contentMessage')
    var contentchat = contentInput.value

    var date = new Date()
    var dateSendChat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    var timeSendChat = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

    socket.emit('send-mes', {
        sender: idSender,
        receiver: idReceiver,
        message: contentchat,
        date: dateSendChat,
        time: timeSendChat,
        image: imageUser
    })
    contentInput.value = ''

    appendMes(contentchat)
}



//hiển thị chat
function displayChat(idReceiver2) {
    var idSender = idUser1;
    var idReceiver = idReceiver2
    $.ajax({
        url: "/contentChat",
        type: "POST",
        data: {
            idSender: idSender,
            idReceiver: idReceiver
        },
        success: function(arr) {
            $('#content').html('')
            $.each(arr, function(key, val) {
                var chat = val.message;
                $('#nameReceiver2').html(val.name)
                document.getElementById('nameReceiver').innerHTML = val.name

                if (val.idSender == idReceiver) {
                    if (chat.includes(".png") || chat.includes(".jpg") || chat.includes("jpeg")) {
                        $('#content').append(`<div class="left">
                        <img class="image-user" src="assets/image/` + val.image + `">
                        <img class="message-image" src="assets/image/` + chat + `">
                        <div class="time">` + val.time + `</div>
                        </div>`)
                        var messageBody = document.querySelector('#mid');
                        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
                    } else {
                        $('#content').append(`<div class="left">
                        <img src="assets/image/` + val.image + `">
                        <div class="message">` + chat + `</div>
                        <div class="time">` + val.time + `</div></div>`)
                        var messageBody = document.querySelector('#mid');
                        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
                    }
                }
                if (val.idSender == idSender) {
                    if (chat.includes(".png") || chat.includes(".jpg") || chat.includes("jpeg")) {
                        $('#content').append(`<div class="right">
                        <div class="time">` + val.time + `</div>
                        <img class="message-image" src="assets/image/` + chat + `">
                        </div>`)
                        var messageBody = document.querySelector('#mid');
                        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
                    } else {
                        $('#content').append(`<div class="right">
                        <div class="time">` + val.time + `</div>
                        <div class="message">` + chat + `</div>
                        </div>`)
                        var messageBody = document.querySelector('#mid');
                        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

                    }
                }
            })
        }
    });
}

//hiển thị list-conversation
function conversation() {
    $('#list-conversation').html('')
    var idUser = idUser1;
    $.ajax({
        url: "/listConversation",
        type: "POST",
        data: {
            idUser: idUser
        },
        success: function(result) {
            $.each(result, function(key, val) {
                $.ajax({
                    url: "/getNameConversation",
                    type: "POST",
                    data: {
                        idReceiver: val.idReceiver,
                        idUser: idUser
                    },
                    success: function(result1) {
                        $.each(result1, function(key, valName) {
                            if (valName.message.includes(".png") || valName.message.includes(".jpg")) {
                                $('#list-conversation').append(`
                                <a href="http://localhost:8000/index&messidfriend=` + val.idReceiver + `" style="text-decoration: none;">
                                <div id="list` + val.idReceiver + `" class="list" onclick="itemList(` + val.idReceiver + `)">
                                <div class="image">
                                <img src="assets/image/` + valName.image + `" alt="">
                                </div>
                                <div class="content-conversation">
                                <div class="name-conversation text-truncate">` + valName.name + " " + valName.surname + `</div>
                                <div class="chat-conversation text-truncate">đã gởi ảnh</div>
                                </div>
                                </div>
                                </a>
                                `)
                            } else {
                                $('#list-conversation').append(`
                                <a href="http://localhost:8000/index&messidfriend=` + val.idReceiver + `" style="text-decoration: none;">
                                <div id="list` + val.idReceiver + `" class="list" onclick="itemList(` + val.idReceiver + `)">
                                <div class="image">
                                <img src="assets/image/` + valName.image + `" alt="">
                                </div>
                                <div class="content-conversation">
                                <div class="name-conversation text-truncate">` + valName.name + " " + valName.surname + `</div>
                                <div class="chat-conversation text-truncate">` + valName.message + `</div>
                                </div>
                                </div>
                                </a>
                                `)
                            }

                        })
                    }
                })

            })
        }
    });
}

function choseImage() {
    // var fileSelector = $('<input class="myfile" onchange="UploadImage(event)" id="myfile" type = "file" multiple />');
    $('.myfile').click()
}

//hủy ảnh đại diện
function huydaidien() {
    document.getElementById("fileanh").value = ""
    $('#chuaanhdaidien').html("")
}

//xem ảnh đại diện
function PreImage(event) {
    if (event) {
        $('#chuaanhdaidien').html('')
        $('#chuaanhdaidien').append(`
                <img class="anhdaidien" src="` + URL.createObjectURL(event.target.files[0]) + `"  style="height: 400px; width: 400px;">
            `);
    }
}

//cập nhật ảnh địa diện
function updateImage() {
    var fileanh = document.getElementById('fileanh').files

    console.log(fileanh)

    var formData = new FormData();
    formData.append("fileanh", fileanh[0])
    formData.append("idUser1", idUser1)

    $.ajax({
        url: '/uploadanhdaidien',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            if (data == "OK") {
                $('#user').click()

                document.getElementById("fileanh").value = ""
                $('#chuaanhdaidien').html("")

                alert('bạn đã cập nhật ảnh thành công')
            }
        }
    });
}

//xem ảnh trước khi gửi
function UploadImage(event) {

    // $('#containerImage').html('')
    // $('#containerImage').append(`         
    // <span class="closeImage" onclick="delImage(` + time + `)" id="closeImage">x</span>
    // <img class="viewImage" src="" id="viewImage" style="height: 40px; width: 40px;">
    // `)
    // var output = document.getElementById('viewImage');
    // output.src = URL.createObjectURL(event.target.files[0]);

    if (event) {
        var total_file = document.getElementById("myfile").files.length;
        if (total_file === 1) {
            var d = new Date()
            var time = d.getTime()
            $('#containerImage').html('')
            $('#containerImage').append(`
                <span class="closeImage" onclick="delImage(` + time + `)" id="closeImage` + time + `">x</span>
                <img class="viewImage" src="` + URL.createObjectURL(event.target.files[0]) + `" id="viewImage` + time + `" style="height: 40px; width: 40px;">
            `);
            var data = URL.createObjectURL(event.target.files[0])
        } else {
            for (var i = 0; i < total_file; i++) {
                var d = new Date()
                var time = d.getTime()
                $('#containerImage').append(`
                <span class="closeImage" onclick="delImage(` + time + `)" id="closeImage` + time + `">x</span>
                <img class="viewImage" src="` + URL.createObjectURL(event.target.files[i]) + `" id="viewImage` + time + `" style="height: 40px; width: 40px;">
            `);
            }
        }
    }

}



//xóa xem ảnh
function delImage(time) {
    document.getElementById('closeImage' + time).remove()
    document.getElementById('viewImage' + time).remove()
}


//nối tiếp ảnh
function appendImage(image, sender, imageuser) {
    if (sender === idReceiver1) {
        $('#content').append(`<div class="left">
        <img src="assets/image/` + imageuser + `">
        <img class="message-image" src="assets/image/` + image + `">
        </div>`)
        var messageBody = document.querySelector('#mid');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    } else {
        $('#content').append(`<div class="right">
        <img class="message-image" src="assets/image/` + image + `">
        </div>`)
        var messageBody = document.querySelector('#mid');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }
}




//gởi ảnh đến server và lưu ảnh
//dùng socket gởi data lên
function saveImage() {
    var idSender = idUser1;
    var idReceiver = idReceiver1;

    var date = new Date()

    var dateSendChat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    var timeSendChat = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

    var myfile = document.getElementById('myfile').files


    var formData = new FormData();
    for (var i = 0; i < myfile.length; i++) {
        formData.append("myfile", myfile[i])
        formData.append("idReceiver", idReceiver)
        formData.append("idSender", idSender)
        formData.append("date", dateSendChat)
        formData.append("time", timeSendChat)
    }

    // var contenttype = {
    //     headers: {
    //         "content-type": "multipart/form-data"
    //     }
    // };

    $.ajax({
        url: '/upload',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            $.each(data, function(key, valName) {
                socket.emit('send-image', {
                    name: valName.name,
                    sender: valName.sender,
                    receiver: valName.receiver,
                    imageuser: imageUser
                })
                appendImage(valName.name)
                conversation()
            })
            imageShare(idReceiver1, idUser1)
        }
    });

    var contentImage = document.getElementById('containerImage')
    contentImage.innerHTML = ''

}



var hihi

function CallVideo(idSender, idReceiver) {
    hihi = window.open(`http://localhost:8000/room&idreceiver=` + idReceiver1 + `&idsender=` + idUser1 + ``, '_blank', 'toolbar=0,location=0,menubar=0,height=700,width=1200');
    //gởi lên server để hiển thị thông báo bên người nhận
    socket.emit('callInvite', {
        sender: idUser1,
        receiver: idReceiver1
    })
}

//hiển thị thông báo
socket.on("checkInvite", data => {
    $('#hello').click()
})

//nhận dữ liệu từ call.js gởi lên
socket.on('viewcall', (roomId, idreceiver, idsender) => {
    document.getElementById("roomid").value = roomId;
    document.getElementById("idreceiver").value = idreceiver;
    document.getElementById("idsender").value = idsender;
    $('#callreceiver').html(idsender)
    $.ajax({
        url: "/namereceiver",
        type: "POST",
        data: {
            id: idsender
        },
        success: function(result) {
            $.each(result, function(key, val) {
                $('#callreceiver').html(val.name + " " + val.surname + " đang gọi cho bạn")
            })
        }
    });
})


function refuse() {
    var idreceiver = document.getElementById("idreceiver").value
    var idsender = document.getElementById("idsender").value
    socket.emit('refuseInvite', idreceiver, idsender)
    $('#hello').click()
}

function AcceptInvite() {
    var roomid = document.getElementById("roomid").value
    $('#hello').click()
    hihi = window.open(`http://localhost:8000/room&id=` + roomid + `&idreceiver=` + idUser1 + `&idsender=` + idReceiver1 + ``, '_blank', 'toolbar=0,location=0,menubar=0,height=700,width=1200');
}


socket.on('userRefuse', data => {
    hihi.close()
})




//chưa làm xong
function itemList(id) {
    displayChat(id)


    // document.getElementById('list' + id).style.backgroundColor = '#252F3C'
}
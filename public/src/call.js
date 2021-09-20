const socket = io('/');


const videoGrid = document.getElementById('video-grid');
const myvideo = document.createElement('video');
//bật âm thanh cho video
myvideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '8000'
})

const peers = {}
let myVideoStream


navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => { //stream là kết quả trả về nó là giao diện đại diện cho 1 dòng nội dung phương tiện truyền thông.
    // console.log(stream)
    myVideoStream = stream
    addVideoStream(myvideo, stream);


    peer.on('call', (call) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('join', (userId) => {
        connectToNewUser(userId, stream)
        console.log("user connect " + userId)
        console.log("stream " + stream)
    })
})


peer.on('open', id => {
    console.log(id + "OK")
    socket.emit('call1', ROOM_ID, id, idReceiver, idsender)
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}


$(document).ready(function() {
    $.ajax({
        url: "/namereceiver",
        type: "POST",
        data: {
            id: idReceiver
        },
        success: function(result) {
            $.each(result, function(key, val) {
                $('#name').html(val.name + " " + val.surname)
            })
        }
    });
})
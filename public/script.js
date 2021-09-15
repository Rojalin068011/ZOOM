const { PeerServer } = require("peer");

//assign the variables
 const socket = io("/");
 const videoGrid = document.getElementById("video-grid");
 const myVideo = document.createElement("video");
 const showChat = document.querySelector("#showChat");
 const backBtn = document.querySelector(".header_back");

 myVideo.muted = true;

 //adding event listners
 backBtn.addEventListener("click", () =>{
     document.querySelector(".main_right").style.display = "none";
     document.querySelector(".header_back").style.display = "none";
     document.querySelector(".main_left").style.display = "flex";
     document.querySelector(".main_left").style.flex = "1";
 })

 showChat.addEventListener("click", () => {
    document.querySelector(".main_right").style.display = "flex";
    document.querySelector(".main_right").style.flex = "1";
    document.querySelector(".main_left").style.display = "none";
    document.querySelector(".header_back").style.display = "block"

 })

 const user = prompt("Ente Your Name");
 var peer = new Peer(undefined, {
     path: "/peerjs",
     host: "/",
     port: "443"
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
})

.then((stream) => {
    myVideoStream = stream;
    addVideostream(myVideo,stream);

    //adding connection to peer
    peer.on("call",(call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream",(userVideoStream) => {
            addVideostream(video,userVideoStream)
        })
    })

    //taking unique user and establishing connection
    socket.on("user-connected",(userId) => {
        connectToNewUser(userId,stream)
    })
})

const connectToNewUser = (userId,stream) =>{
    const call = peer.call(userId,stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideostream(video,userVideoStream);
    })
};

peer.on("open",(id) => {
    socket.emit("join-room", ROOM_ID, id, user);
});

const addVideostream = (video, stream) => {
    video.srcObject =stream;
    video.addEventListener("loadmetadata", () => {
        video.play();
        videoGrid.append(video);
    })
};

//chat
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");




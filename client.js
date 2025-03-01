const socket = io();

const remoteVideo = document.getElementById("remoteVideo");
const startButton = document.getElementById("startButton");

let peerConnection;
const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Free STUN server
    ],
};

peerConnection = new RTCPeerConnection(config);

// Debug ICE connection state changes
peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE State:", peerConnection.iceConnectionState);
};


// Start streaming
startButton.addEventListener("click", async () => {
    try {
        // Create a new RTCPeerConnection
        peerConnection = new RTCPeerConnection(config);

        // Handle incoming video tracks
        peerConnection.ontrack = (event) => {
            remoteVideo.srcObject = event.streams[0];
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("signal", { candidate: event.candidate });
            }
        };

        // Create an offer and set it as the local description
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("signal", { offer: offer });
    } catch (error) {
        console.error("Error starting streaming:", error);
    }
});

// Handle signaling messages from the server
socket.on("signal", async (data) => {
    if (data.offer) {
        // If an offer is received, create an answer
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("signal", { answer: answer });
    } else if (data.answer) {
        // If an answer is received, set it as the remote description
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.candidate) {
        // If an ICE candidate is received, add it to the peer connection
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
});
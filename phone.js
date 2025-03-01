const socket = io();

const localVideo = document.getElementById("localVideo");
const startButton = document.getElementById("startButton");

const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Free STUN server
    ],
};

startButton.addEventListener("click", async () => {
    try {
        console.log("Start Camera button clicked!");

        // Access the phone's camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        localVideo.srcObject = stream;
        console.log("Camera stream started:", stream);

        // Create a new RTCPeerConnection
        const peerConnection = new RTCPeerConnection(config);

        // Debug ICE connection state changes
        peerConnection.oniceconnectionstatechange = () => {
            console.log("ICE State:", peerConnection.iceConnectionState);
        };

        // Add the camera stream to the peer connection
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
        });

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("signal", { candidate: event.candidate });
                console.log("ICE Candidate sent:", event.candidate);
            }
        };

        // Handle incoming signaling messages
        socket.on("signal", async (data) => {
            console.log("Received signaling message:", data);
            if (data.answer) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.candidate) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        });

        // Create an offer and set it as the local description
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("signal", { offer: offer });
        console.log("Offer sent:", offer);

    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Failed to access the camera. Please check permissions.");
    }
});

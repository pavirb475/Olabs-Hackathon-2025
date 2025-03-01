const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the front-end files
app.use(express.static("public"));

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle signaling messages
    socket.on("signal", (data) => {
        // Broadcast the signal to other users
        socket.broadcast.emit("signal", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://192.168.73.108:${PORT}`);
});

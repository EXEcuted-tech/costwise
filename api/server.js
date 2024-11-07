const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // CORS setup
app.options("*", cors({ origin: "http://localhost:3000" }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const emitAuditLogs = () => {
    const auditLogs = getAuditLogs(); // Fetch audit logs
    io.emit("auditLogsUpdate", auditLogs);
};

server.listen(8000, () => {
    console.log("Server is listening on http://localhost:8000");
});
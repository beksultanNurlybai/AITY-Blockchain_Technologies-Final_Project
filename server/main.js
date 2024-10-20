const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

// Connect to MongoDB
connectDB();

// Your existing code...

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

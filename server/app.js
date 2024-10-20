const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

// Directory to store uploaded files
const filesDirectory = path.join(__dirname, 'files');

app.use(express.json());

// API endpoint to upload files
app.post('/api/upload', (req, res) => {
    const filename = req.body.filename;
    const fileContent = req.body.content;

    const filePath = path.join(filesDirectory, filename);
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File could not be saved' });
        }
        console.log(`File ${filename} uploaded.`);

        // Notify all connected WebSocket clients about the new file
        const message = JSON.stringify({ event: 'new_file', filename });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        res.json({ message: 'File uploaded and clients notified' });
    });
});

// API endpoint to serve uploaded files
app.get('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;

    if (path.extname(filename) !== '.py') {
        return res.status(400).json({ error: 'Only .py files are allowed' });
    }

    const filePath = path.join(filesDirectory, filename);
    res.sendFile(filePath);
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');

    // Optional: Handle messages from the client
    ws.on('message', (msg) => {
        console.log('Message from client:', msg);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

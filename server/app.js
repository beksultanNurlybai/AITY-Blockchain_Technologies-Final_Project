const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

const filesDirectory = path.join(__dirname, 'files');

app.use(express.json());

const validKeys = {
    "1234": true,
    "1111": true,
    "2003": true,
};

app.post('/api/upload', (req, res) => {
    const filename = req.body.filename;
    const fileContent = req.body.content;

    const filePath = path.join(filesDirectory, filename);
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File could not be saved' });
        }
        console.log(`File ${filename} uploaded.`);

        const message = JSON.stringify({ event: 'new_file', filename });
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        res.json({ message: 'File uploaded and clients notified' });
    });
});

app.get('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;

    if (path.extname(filename) !== '.py') {
        return res.status(400).json({ error: 'Only .py files are allowed' });
    }

    const filePath = path.join(filesDirectory, filename);
    res.sendFile(filePath);
});

app.post('/api/results', (req, res) => {
    const file_output = req.body.file_output;
    console.log(file_output);
    res.json({ message: 'file execution output uploaded.' });
});


wss.on('connection', (ws, req) => {
    console.log('Client attempting connection via WebSocket');
    const query = url.parse(req.url, true).query;
    const key = query.key;

    if (validKeys[key]) {
        console.log(`Client connected with valid key: ${key}`);
        const message = JSON.stringify({ event: 'login', is_valid: true });
        ws.send(message);

        // Optional: Handle messages from the client
        ws.on('message', (msg) => {
            console.log('Message from client:', msg);
        });
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    } else {
        console.log(`Client attempted connection with invalid key: ${key}`);
        const message = JSON.stringify({ event: 'login', is_valid: false });
        ws.send(message);
        ws.close();
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

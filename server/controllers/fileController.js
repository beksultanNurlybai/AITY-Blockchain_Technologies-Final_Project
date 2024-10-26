const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const {sendMessageToClientApp} = require('./websocketController');

const filesDirectory = path.join(__dirname, '..', 'uploads');

exports.uploadFile = async (req, res) => {
    const content = req.body.content;
    const provider_id = req.body.provider_id;

    const user = await User.findOne({ user_id: provider_id });
    if (!user) {
        res.json({ message: 'Error validating key' });
        return;
    }
    const message = { event: 'new_file_req', content };
    sendMessageToClientApp(provider_id, message);
    res.json({ message: 'File execution output uploaded.' });
};

exports.getFile = (req, res) => {
    const filename = req.params.filename;

    if (path.extname(filename) !== '.py') {
        return res.status(400).json({ error: 'Only .py files are allowed' });
    }

    const filePath = path.join(filesDirectory, filename);
    res.sendFile(filePath);
};

exports.uploadResults = (req, res) => {
    const file_output = req.body.file_output;
    console.log(file_output);
    res.json({ message: 'File execution output uploaded.' });
};

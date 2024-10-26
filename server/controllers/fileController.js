const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const {sendMessageToClientApp} = require('./websocketController');


exports.upload = async (req, res) => {
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
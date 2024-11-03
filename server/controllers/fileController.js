const User = require('../models/User');
const {sendMessageToClientApp, fileResponseHandlers} = require('./websocketController');

exports.upload = async (req, res) => {
    const content = req.body.content;
    if (!req.session.user_id) {
        return res.status(403).send("Forbidden URL");
    }

    const user = await User.findOne({ user_id: req.session.user_id });
    if (!user) {
        return res.status(500).send("User not found.");
    }

    if (!user.provider_id) {
        return res.status(400).send("User doesn't have provider.");
    }

    const request_id = `${user.user_id}-${Date.now()}`;
    const message = { event: 'new_file_req', content, request_id };

    fileResponseHandlers.set(request_id, (output) => {
        res.status(200).json({ message: 'File execution output received.', output });
        fileResponseHandlers.delete(request_id);
    });

    sendMessageToClientApp(user.provider_id, message);
};

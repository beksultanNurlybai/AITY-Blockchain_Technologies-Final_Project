const crypto = require('crypto');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { user_id, role } = req.body;
    try {
        let user = await User.findOne({ user_id });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (role == 'provider') {
            let key;
            let isUnique = false;

            while (!isUnique) {
                key = crypto.randomBytes(20).toString('hex').slice(0, 20);
                const existingKey = await User.findOne({ key });
                isUnique = !existingKey;
            }
            user = new User({ user_id, role, key, is_active: false });
        } else {
            user = new User({ user_id, role});
        }
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { user_id } = req.body;
    try {
        let user = await User.findOne({ user_id });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

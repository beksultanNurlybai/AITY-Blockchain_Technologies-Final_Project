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
            user = new User({ user_id, role });
        }

        await user.save();

        req.session.user_id = user.user_id;
        req.session.role = user.role;

        return res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { user_id } = req.body;
    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        req.session.user_id = user.user_id;
        req.session.role = user.role;

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.redirect('/');
    });
};


exports.buyResource = async (req, res) => {
    try {
        const { user_id, provider_id } = req.body;
        
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        user.provider_id = provider_id;
        await user.save();

        res.status(200).json({ message: "Provider connected to renter successfully" });
    } catch (error) {
        console.error("Error saving provider-renter connection:", error);
        res.status(500).json({ error: "An error occurred while connecting provider to renter" });
    }
};

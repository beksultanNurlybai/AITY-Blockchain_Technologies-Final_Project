const crypto = require('crypto');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
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

exports.loginUser = async (req, res) => {
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

exports.addResource = async (req, res) => {
    const { key, processor_name, cpu_count, ram_size } = req.body;
    try {
        let user = await User.findOne({ key });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        user.resource_id = { processor_name, cpu_count, ram_size };
        await user.save();

        res.status(200).json({ message: 'Resource added successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// exports.rentResource = async (req, res) => {
//     const { renter_id, owner_id } = req.body;

//     try {
//         let renter = await User.findOne({ user_id: renter_id });
//         let owner = await User.findOne({ user_id: owner_id });

//         if (!renter || renter.role !== 'renter') {
//             return res.status(400).json({ message: 'Renter not found or not a renter' });
//         }

//         if (!owner || owner.role !== 'owner') {
//             return res.status(400).json({ message: 'Owner not found or not an owner' });
//         }

//         renter.provider_id = owner.user_id;
//         await renter.save();

//         res.status(200).json({ message: 'Resource rented successfully', renter });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const { contract, web3 } = require('../web3');
const User = require('../models/User');


exports.info = async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const provider = await contract.methods.providers(accounts[1]).call();

        const providerSerialized = Object.fromEntries(
            Object.entries(provider).map(([key, value]) =>
                typeof value === 'bigint' ? [key, value.toString()] : [key, value]
            )
        );

        res.json(providerSerialized);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registerProvider = async (req, res) => {
    try {
        const { price, account } = req.body;
        await contract.methods.registerProvider(price).send({ from: account });

        const user = await User.findOne({user_id: account});
        user.resource.price = price;
        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Registration failed:", error);
        res.status(500).send("Registration failed. Please try again.");
    }
};
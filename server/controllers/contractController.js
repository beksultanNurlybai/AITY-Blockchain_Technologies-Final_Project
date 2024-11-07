const { contract, web3 } = require('../web3');

exports.info = async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const provider = await contract.methods.providers(accounts[0]).call();

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
      const { pricePerMonth } = req.body;
      const accounts = await web3.eth.getAccounts();
      await contract.methods.registerProvider(pricePerMonth).send({ from: accounts[0] });
      res.json({ success: true, message: 'Provider registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
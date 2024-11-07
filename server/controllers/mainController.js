const User = require('../models/User');

exports.mainPage = async (req, res) => {
    try {
        const providers = await User.find({ role: 'provider', 'resource.price': { $gt: 0 } }, ['user_id', 'resource']);
        const resources = providers.map(provider => ({
            cpuName: provider.resource.processor_name,
            cpuCount: provider.resource.cpu_count,
            ramSize: provider.resource.ram_size,
            provider_id: provider.user_id,
            price: provider.resource.price
        }));
        res.render('index', { resources, session: req.session, isAnyResource: resources.length != 0 });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.workplacePage = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/');
        }
        const user = await User.findOne({user_id: req.session.user_id});
        if (!user) {
            return res.redirect('/');
        }
        if (user.role == 'provider'){
            const renter = await User.findOne({provider_id: user.user_id});
            return res.render('workplace', { user, renter });
        }
        const provider = await User.findOne({user_id: user.provider_id});
        return res.render('workplace', { user, provider });
    } catch (error) {
        console.error("Error loading workplace page:", error);
        res.status(500).send("Server error");
    }
};

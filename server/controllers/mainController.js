const User = require('../models/User');

exports.mainPage = async (req, res) => {
    try {
        const providers = await User.find({ role: 'provider', resource: { $exists: true } }, ['user_id', 'resource']);
        const resources = providers.map(provider => ({
            cpuName: provider.resource.processor_name,
            cpuCount: provider.resource.cpu_count,
            ramSize: provider.resource.ram_size,
            provider_id: provider.user_id,
        }));
        console.log(req.session);
        res.render('index', { resources, session: req.session });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal Server Error");
    }
};

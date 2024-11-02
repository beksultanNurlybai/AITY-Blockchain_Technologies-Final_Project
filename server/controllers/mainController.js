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
        res.render('index', { resources, session: req.session, isAnyResource: resources.length != 0 });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.workplacePage = async (req, res) => {
    
};

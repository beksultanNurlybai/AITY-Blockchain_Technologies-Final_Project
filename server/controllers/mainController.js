const User = require('../models/User'); // Adjust path as necessary

exports.mainPage = async (req, res) => {
    try {
        // Fetch all resources from owners
        const owners = await User.find({ role: 'owner', resource: { $exists: true } }, 'resource');

        // Map data to extract necessary fields
        const resources = owners.map(owner => ({
            cpuName: owner.resource.processor_name,
            cpuCount: owner.resource.cpu_count,
            ramSize: owner.resource.ram_size,
        }));

        // Render the index.ejs page with resources data
        res.render('index', { resources });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).send("Internal Server Error");
    }
};

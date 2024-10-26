exports.registerPage = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

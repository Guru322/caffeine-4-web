const Website = require('../models/Website');

exports.addWebsite = async (req, res) => {
    const { url } = req.body;
    try {
        const newWebsite = new Website({ url });
        await newWebsite.save();
        res.status(201).json(newWebsite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getWebsites = async (req, res) => {
    try {
        const websites = await Website.find();
        res.status(200).json(websites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteWebsite = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedWebsite = await Website.findByIdAndDelete(id);
        if (!deletedWebsite) {
            return res.status(404).json({ message: 'Website not found' });
        }
        res.status(200).json({ message: 'Website deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
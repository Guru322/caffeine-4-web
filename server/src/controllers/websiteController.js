const Website = require('../models/Website');
const PingResult = require('../models/PingResult');

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

/**
 * Delete a website by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteWebsite = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid website ID format' });
        }

        const deletedWebsite = await Website.findByIdAndDelete(id);
        
        if (!deletedWebsite) {
            return res.status(404).json({ error: 'Website not found' });
        }
        
        await PingResult.deleteMany({ website: id });
        
        return res.status(200).json({ message: 'Website deleted successfully' });
    } catch (error) {
        console.error('Error deleting website:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
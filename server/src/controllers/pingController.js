const PingResult = require('../models/PingResult');
const Website = require('../models/Website');
const axios = require('axios');
const { pingWebsite } = require('../services/monitoringService');

exports.pingWebsite = async (req, res) => {
    const { websiteId } = req.params;

    try {
        const website = await Website.findById(websiteId);
        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }

        const start = Date.now();
        const response = await axios.get(website.url);
        const responseTime = Date.now() - start;

        const pingResult = new PingResult({
            website: websiteId,
            timestamp: new Date(),
            responseTime: responseTime,
        });

        await pingResult.save();

        res.status(200).json({
            message: 'Ping successful',
            responseTime: responseTime,
            status: response.status,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error pinging website', error: error.message });
    }
};

exports.getPingResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 20 } = req.query;
        
        const pingResults = await PingResult.find({ website: id })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));
            
        res.status(200).json(pingResults);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ping results', error: error.message });
    }
};

exports.triggerPing = async (req, res) => {
    try {
        const { id } = req.params;
        
        const website = await Website.findById(id);
        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }
        
        const pingResult = await pingWebsite(website);
        res.status(200).json(pingResult);
    } catch (error) {
        res.status(500).json({ message: 'Error pinging website', error: error.message });
    }
};
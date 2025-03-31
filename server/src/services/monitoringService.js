const mongoose = require('mongoose');
const axios = require('axios');
const Website = require('../models/Website');
const PingResult = require('../models/PingResult');

const pingWebsite = async (website) => {
    try {
        const start = Date.now();
        const response = await axios.get(website.url, {
            timeout: 5000 
        });
        const duration = Date.now() - start;

        const pingResult = new PingResult({
            website: website._id, 
            timestamp: new Date(),
            responseTime: duration,
            status: response.status,
            isUp: response.status >= 200 && response.status < 400
        });

        await pingResult.save();
        console.log(`Pinged ${website.url} - Status: ${response.status} - Response Time: ${duration}ms`);
        return pingResult;
    } catch (error) {
        const pingResult = new PingResult({
            website: website._id, 
            timestamp: new Date(),
            responseTime: 0, 
            status: error.response ? error.response.status : 'DOWN',
            isUp: false,
            error: error.message
        });

        await pingResult.save();
        console.log(`Failed to ping ${website.url} - Status: ${pingResult.status}`);
        return pingResult;
    }
};

const startMonitoring = () => {
    console.log("Starting monitoring service...");
    setInterval(async () => {
        try {
            const websites = await Website.find();
            console.log(`Checking ${websites.length} websites...`);
            for (const website of websites) {
                try {
                    await pingWebsite(website);
                } catch (error) {
                    console.error(`Error monitoring website ${website.url}:`, error);
                }
            }
        } catch (error) {
            console.error("Error in monitoring loop:", error);
        }
    }, 30000); // 30 seconds
};

module.exports = {
    startMonitoring,
    pingWebsite
};
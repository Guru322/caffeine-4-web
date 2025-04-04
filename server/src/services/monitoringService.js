const axios = require('axios');
const { db, admin } = require('../config/firebase');
const { checkAndSendNotifications } = require('./notificationService');

const pingWebsite = async (website) => {
    try {
        const start = Date.now();
        const response = await axios.get(website.url, {
            timeout: 5000 
        });
        const duration = Date.now() - start;

        const pingResult = {
            websiteId: website.id, 
            timestamp: admin.firestore.Timestamp.now(),
            responseTime: duration,
            status: response.status,
            isUp: response.status >= 200 && response.status < 400
        };

        await db.collection('pingResults').add(pingResult);
        
        await db.collection('websites').doc(website.id).update({
            status: 'up',
            lastChecked: admin.firestore.Timestamp.now()
        });
        
        await checkAndSendNotifications(website, pingResult);
        
        console.log(`Pinged ${website.url} - Status: ${response.status} - Response Time: ${duration}ms`);
        return pingResult;
    } catch (error) {
        const pingResult = {
            websiteId: website.id, 
            timestamp: admin.firestore.Timestamp.now(),
            responseTime: 0, 
            status: error.response ? error.response.status : 'DOWN',
            isUp: false,
            error: error.message
        };

        await db.collection('pingResults').add(pingResult);
        
        await db.collection('websites').doc(website.id).update({
            status: 'down',
            lastChecked: admin.firestore.Timestamp.now()
        });
        
        await checkAndSendNotifications(website, pingResult);
        
        console.log(`Failed to ping ${website.url} - Status: ${pingResult.status}`);
        return pingResult;
    }
};

const startMonitoring = () => {
    console.log("Starting monitoring service...");
    setInterval(async () => {
        try {
            const websitesSnapshot = await db.collection('websites').get();
            console.log(`Checking ${websitesSnapshot.size} websites...`);
            
            const websites = [];
            websitesSnapshot.forEach(doc => {
                websites.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
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
    }, 30000); 
};

module.exports = {
    startMonitoring,
    pingWebsite
};
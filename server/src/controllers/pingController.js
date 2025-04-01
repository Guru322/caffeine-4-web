const axios = require('axios');
const { db, admin } = require('../config/firebase');
const { pingWebsite } = require('../services/monitoringService');

exports.pingWebsite = async (req, res) => {
    const { websiteId } = req.params;

    try {
        const websiteDoc = await db.collection('websites').doc(websiteId).get();
        
        if (!websiteDoc.exists) {
            return res.status(404).json({ message: 'Website not found' });
        }
        
        const website = {
            id: websiteDoc.id,
            ...websiteDoc.data()
        };

        const start = Date.now();
        const response = await axios.get(website.url, { timeout: 5000 });
        const responseTime = Date.now() - start;

        const pingResult = {
            websiteId: websiteId,
            timestamp: admin.firestore.Timestamp.now(),
            responseTime: responseTime,
            status: response.status,
            isUp: response.status >= 200 && response.status < 400
        };

        const docRef = await db.collection('pingResults').add(pingResult);

        await db.collection('websites').doc(websiteId).update({
            status: 'up',
            lastChecked: admin.firestore.Timestamp.now()
        });

        res.status(200).json({
            id: docRef.id,
            message: 'Ping successful',
            responseTime: responseTime,
            status: response.status,
            isUp: true
        });
    } catch (error) {
        const pingResult = {
            websiteId: websiteId,
            timestamp: admin.firestore.Timestamp.now(),
            responseTime: 0,
            status: error.response ? error.response.status : 'DOWN',
            isUp: false,
            error: error.message
        };

        try {
            await db.collection('pingResults').add(pingResult);
            
            await db.collection('websites').doc(websiteId).update({
                status: 'down',
                lastChecked: admin.firestore.Timestamp.now()
            });
        } catch (firebaseError) {
            console.error('Error saving ping failure to Firebase:', firebaseError);
        }

        res.status(500).json({ 
            message: 'Error pinging website', 
            error: error.message,
            isUp: false
        });
    }
};

exports.getPingResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 20 } = req.query;
        
        // Query Firestore for ping results
        const pingResultsRef = db.collection('pingResults');
        const q = pingResultsRef
            .where('websiteId', '==', id)
            .orderBy('timestamp', 'desc')
            .limit(parseInt(limit));
        
        const snapshot = await q.get();
        
        const pingResults = [];
        snapshot.forEach(doc => {
            pingResults.push({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore timestamp to JS Date for consistent API
                timestamp: doc.data().timestamp.toDate()
            });
        });
            
        res.status(200).json(pingResults);
    } catch (error) {
        console.error('Error fetching ping results:', error);
        res.status(500).json({ message: 'Error fetching ping results', error: error.message });
    }
};

exports.triggerPing = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get website from Firestore
        const websiteDoc = await db.collection('websites').doc(id).get();
        
        if (!websiteDoc.exists) {
            return res.status(404).json({ message: 'Website not found' });
        }
        
        const website = {
            id: websiteDoc.id,
            ...websiteDoc.data()
        };
        
        // Use the monitoring service to ping the website
        const pingResult = await pingWebsite(website);
        res.status(200).json(pingResult);
    } catch (error) {
        console.error('Error triggering ping:', error);
        res.status(500).json({ message: 'Error pinging website', error: error.message });
    }
};
const { db } = require('../config/firebase');

exports.addWebsite = async (req, res) => {
    const { url, userId } = req.body;
    try {
        const newWebsite = { 
            url, 
            userId,
            status: 'up',
            createdAt: new Date()
        };
        
        const docRef = await db.collection('websites').add(newWebsite);
        res.status(201).json({ 
            id: docRef.id,
            ...newWebsite 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getWebsites = async (req, res) => {
    try {
        const { userId } = req.query;
        let websitesQuery = db.collection('websites');
        
        if (userId) {
            websitesQuery = websitesQuery.where('userId', '==', userId);
        }
        
        const snapshot = await websitesQuery.get();
        const websites = [];
        
        snapshot.forEach(doc => {
            websites.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
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
        
        await db.collection('websites').doc(id).delete();
        
        const pingResultsSnapshot = await db.collection('pingResults')
            .where('websiteId', '==', id)
            .get();
            
        const batch = db.batch();
        pingResultsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        
        return res.status(200).json({ message: 'Website deleted successfully' });
    } catch (error) {
        console.error('Error deleting website:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
const { db, admin } = require('../config/firebase');

const cleanupOldPingResults = async (daysToKeep = 7) => {
  try {
    console.log(`Cleaning up ping results older than ${daysToKeep} days...`);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);
    
    const pingResultsRef = db.collection('pingResults');
    const oldResultsQuery = await pingResultsRef
      .where('timestamp', '<', cutoffTimestamp)
      .get();
    
    if (oldResultsQuery.empty) {
      console.log('No old ping results to delete');
      return 0;
    }
    
    const batchSize = 500;
    let deleteCount = 0;
    let batch = db.batch();
    let batchCount = 0;
    
    oldResultsQuery.forEach(doc => {
      batch.delete(doc.ref);
      batchCount++;
      deleteCount++;
      
      if (batchCount >= batchSize) {
        batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    });
    
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`Deleted ${deleteCount} old ping results`);
    return deleteCount;
  } catch (error) {
    console.error('Error cleaning up old ping results:', error);
    throw error;
  }
};

module.exports = { cleanupOldPingResults };
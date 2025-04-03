import { 
    fetchWebsites as fetchFirestoreWebsites,
    addWebsite as addFirestoreWebsite,
    fetchPingResults as fetchFirestorePingResults,
    deleteWebsite as deleteFirestoreWebsite,
    // Add new imports:
    fetchWebsiteDetails as fetchFirestoreWebsiteDetails,
    fetchUptimeData as fetchFirestoreUptimeData,
    fetchResponseTimeData as fetchFirestoreResponseTimeData
} from './firestoreService';

export const fetchWebsites = async () => {
    try {
        return await fetchFirestoreWebsites();
    } catch (error) {
        console.error('Error fetching websites:', error);
        throw error;
    }
};

export const addWebsite = async (website) => {
    try {
        return await addFirestoreWebsite(website);
    } catch (error) {
        console.error('Error adding website:', error);
        throw error;
    }
};

export const fetchPingResults = async (websiteId) => {
    try {
        return await fetchFirestorePingResults(websiteId);
    } catch (error) {
        console.error('Error fetching ping results:', error);
        throw error;
    }
};

export const deleteWebsite = async (websiteId) => {
    try {
        return await deleteFirestoreWebsite(websiteId);
    } catch (error) {
        console.error('Error deleting website:', error);
        throw error;
    }
};

export const fetchWebsiteDetails = async (websiteId) => {
  try {
    return await fetchFirestoreWebsiteDetails(websiteId);
  } catch (error) {
    console.error('Error fetching website details:', error);
    throw error;
  }
};

export const fetchUptimeData = async (websiteId, days = 7) => {
  try {
    return await fetchFirestoreUptimeData(websiteId, days);
  } catch (error) {
    console.error('Error fetching uptime data:', error);
    throw error;
  }
};

export const fetchResponseTimeData = async (websiteId, hours = 24) => {
  try {
    return await fetchFirestoreResponseTimeData(websiteId, hours);
  } catch (error) {
    console.error('Error fetching response time data:', error);
    throw error;
  }
};
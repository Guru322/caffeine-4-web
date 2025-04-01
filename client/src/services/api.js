import { 
    fetchWebsites as fetchFirestoreWebsites,
    addWebsite as addFirestoreWebsite,
    fetchPingResults as fetchFirestorePingResults,
    deleteWebsite as deleteFirestoreWebsite
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
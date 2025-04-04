import { 
    fetchWebsites as fetchFirestoreWebsites,
    addWebsite as addFirestoreWebsite,
    fetchPingResults as fetchFirestorePingResults,
    deleteWebsite as deleteFirestoreWebsite,
    fetchWebsiteDetails as fetchFirestoreWebsiteDetails,
    fetchUptimeData as fetchFirestoreUptimeData,
    fetchResponseTimeData as fetchFirestoreResponseTimeData
} from './firestoreService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';


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

export const fetchUserSettings = async () => {
  try {
    const auth = getAuth();
    
    if (!auth.currentUser) {
      console.warn('No authenticated user found');
      return { emailNotificationsEnabled: false, notificationDelay: 60, websites: {} };
    }
    
    const currentUserId = auth.currentUser.uid;
    
    const userDocRef = doc(db, 'users', currentUserId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const notificationSettings = userData.notificationSettings || {};
      
      return {
        emailNotificationsEnabled: notificationSettings.emailNotificationsEnabled || false,
        notificationDelay: notificationSettings.notificationDelay || 60,
        websites: notificationSettings.websites || {},
        ...notificationSettings
      };
    }
    
    return { 
      emailNotificationsEnabled: false, 
      notificationDelay: 60, 
      websites: {} 
    };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return { 
      emailNotificationsEnabled: false, 
      notificationDelay: 60, 
      websites: {} 
    };
  }
};

export const updateNotificationSettings = async (settings) => {
  try {
    const auth = getAuth();
    
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    const currentUserId = auth.currentUser.uid;
    
    const safeSettings = {
      ...settings,
      websites: settings.websites || {}
    };
    
    const userDocRef = doc(db, 'users', currentUserId);
    await setDoc(userDocRef, {
      notificationSettings: safeSettings
    }, { merge: true });
    
    console.log('Notification settings updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};
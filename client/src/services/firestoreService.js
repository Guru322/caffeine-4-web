import { collection, addDoc, getDocs, query, where, doc, deleteDoc, orderBy, limit, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export const addWebsite = async (website) => {
  try {
    const auth = getAuth();
    const newWebsite = {
      url: website.url,
      name: website.name || website.url,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      status: 'up'
    };
    
    const docRef = await addDoc(collection(db, "websites"), newWebsite);
    return { ...newWebsite, id: docRef.id };
  } catch (error) {
    console.error('Error adding website:', error);
    throw error;
  }
};

export const fetchWebsites = async () => {
  try {
    const auth = getAuth();
    const websitesRef = collection(db, "websites");
    const q = query(websitesRef, where("userId", "==", auth.currentUser.uid));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      _id: doc.id, 
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

export const deleteWebsite = async (websiteId) => {
  try {
    await deleteDoc(doc(db, "websites", websiteId));
    return { message: 'Website deleted successfully' };
  } catch (error) {
    console.error('Error deleting website:', error);
    throw error;
  }
};

export const fetchPingResults = async (websiteId, resultLimit = 20) => {
  try {
    const pingResultsRef = collection(db, "pingResults");
    const q = query(
      pingResultsRef, 
      where("websiteId", "==", websiteId),
      orderBy("timestamp", "desc"),
      limit(resultLimit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp ? data.timestamp.toDate() : null
      };
    });
  } catch (error) {
    console.error('Error fetching ping results:', error);
    throw error;
  }
};

export const fetchWebsiteDetails = async (websiteId) => {
  try {
    // Fetch website info
    const websiteRef = doc(db, "websites", websiteId);
    const websiteSnapshot = await getDoc(websiteRef);
    
    if (!websiteSnapshot.exists()) {
      throw new Error('Website not found');
    }
    
    const websiteData = websiteSnapshot.data();
    const website = {
      id: websiteSnapshot.id,
      ...websiteData,
      lastChecked: websiteData.lastChecked
    };
    
    // Fetch the latest ping result
    const pingResultsRef = collection(db, "pingResults");
    const q = query(
      pingResultsRef,
      where("websiteId", "==", websiteId),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    
    const latestPingQuerySnapshot = await getDocs(q);
    
    if (!latestPingQuerySnapshot.empty) {
      const latestPingDoc = latestPingQuerySnapshot.docs[0];
      const pingData = latestPingDoc.data();
      website.latestPing = {
        id: latestPingDoc.id,
        ...pingData,
        timestamp: pingData.timestamp ? pingData.timestamp.toDate() : null
      };
    }
    
    return website;
  } catch (error) {
    console.error('Error fetching website details:', error);
    throw error;
  }
};

export const fetchUptimeData = async (websiteId, days = 7) => {
  try {
    // Calculate date for filtering
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get ping results with just the websiteId filter
    const pingResultsRef = collection(db, "pingResults");
    const q = query(
      pingResultsRef,
      where("websiteId", "==", websiteId),
      orderBy("timestamp", "desc") 
    );
    
    const querySnapshot = await getDocs(q);
    
    // Process data to calculate daily uptime percentages
    const pingsByDay = {};
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const timestamp = data.timestamp.toDate();
      
      // Filter in memory for date range
      if (timestamp >= startDate) {
        const dateKey = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (!pingsByDay[dateKey]) {
          pingsByDay[dateKey] = { total: 0, up: 0 };
        }
        
        pingsByDay[dateKey].total++;
        if (data.isUp) {
          pingsByDay[dateKey].up++;
        }
      }
    });
    
    // Generate a complete array of days
    const labels = [];
    const values = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      labels.push(new Date(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      if (pingsByDay[dateKey]) {
        const uptime = (pingsByDay[dateKey].up / pingsByDay[dateKey].total) * 100;
        values.push(Math.round(uptime * 100) / 100); // Round to 2 decimal places
      } else {
        values.push(null); // No data for this day
      }
    }
    
    return { labels, values };
  } catch (error) {
    console.error('Error fetching uptime data:', error);
    throw error;
  }
};

export const fetchResponseTimeData = async (websiteId, hours = 24) => {
  try {
    // Calculate time for filtering
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);
    
    // Get ping results with just the websiteId filter
    const pingResultsRef = collection(db, "pingResults");
    const q = query(
      pingResultsRef,
      where("websiteId", "==", websiteId),
      orderBy("timestamp", "desc") 
    );
    
    const querySnapshot = await getDocs(q);
    
    // Process data - filter by time in memory
    const filteredData = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const timestamp = data.timestamp.toDate();
      
      if (timestamp >= startDate) {
        filteredData.push({
          time: timestamp,
          responseTime: data.responseTime
        });
      }
    });
    
    filteredData.sort((a, b) => a.time - b.time);
    
    const labels = filteredData.map(item => 
      item.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    );
    
    const values = filteredData.map(item => item.responseTime);
    
    return { labels, values };
  } catch (error) {
    console.error('Error fetching response time data:', error);
    throw error;
  }
};
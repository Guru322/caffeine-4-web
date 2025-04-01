import { collection, addDoc, getDocs, query, where, doc, deleteDoc, orderBy, limit } from 'firebase/firestore';
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
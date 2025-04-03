import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your_api_key_here",
  authDomain: "your _auth_domain_here",
  projectId: "your_project_id_here",
  storageBucket: "your_storage_bucket_here",
  messagingSenderId: "your_messaging_sender_id_here",
  appId: "your_app_id_here",
  measurementId: "your_measurement_id_here"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
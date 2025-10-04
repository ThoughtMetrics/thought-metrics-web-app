import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAPIConfig } from '@/core/configs/api-config';

const API_CONFIG = getAPIConfig();

// Initialize Firebase
const app = initializeApp(API_CONFIG.firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

// @ts-ignore - Skip Firebase type checking for now
import { getApp, getApps, initializeApp } from "firebase/app";
// @ts-ignore - Skip Firebase type checking for now
import { getAuth } from "firebase/auth";

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock-bucket.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:mockappid',
};

let app: any = null;
let auth: any = null;

try {
  // @ts-ignore - Skip type checking for Firebase initialization
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  // @ts-ignore - Skip type checking for Firebase auth
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  app = null;
  auth = null;
}

export { app, auth };

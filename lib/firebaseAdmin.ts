// lib/firebaseAdmin.ts
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Only load the service account JSON when on the server
const serviceAccount = process.env.FIREBASE_ADMIN_KEY
  ? JSON.parse(process.env.FIREBASE_ADMIN_KEY)
  : undefined;

if (!serviceAccount) {
  throw new Error('Missing FIREBASE_ADMIN_KEY env variable');
}


// Initialize the Firebase Admin app once
const adminApp: App = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApps()[0];

// Export the Firestore admin database instance
export const adminDb = getFirestore(adminApp);

/**
 * @file Firebase app + messaging initialisation
 * @description Initialises Firebase from VITE_FIREBASE_* env vars and provides a lazy getter for FCM messaging.
 * @service Firebase Cloud Messaging (web push notifications)
 */
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Missing Firebase config. Ensure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID are set in secret/.env",
  );
}

export const app = initializeApp(firebaseConfig);

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

/**
 * Lazily returns a Messaging instance. Returns null if FCM is not supported
 * (e.g. no service worker, insecure context, or non-browser environment).
 */
export async function getMessagingInstance() {
  if (messagingInstance) return messagingInstance;
  const supported = await isSupported();
  if (!supported) return null;
  messagingInstance = getMessaging(app);

  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_FCM_VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: registration,
    });
  } catch {
    // SW registration or token retrieval failed — FCM is non-blocking
  }

  return messagingInstance;
}

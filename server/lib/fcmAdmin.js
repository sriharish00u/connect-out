/**
 * @file Firebase Admin SDK — push notification sender
 * @description Initialises firebase-admin with the service account and FCM private key,
 *              then exports a helper to send web push notifications via FCM.
 * @service Firebase Cloud Messaging (server-side push)
 */
import admin from "firebase-admin";

const privateKey = process.env.FCM_WEBPUSH_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("Missing FCM_WEBPUSH_PRIVATE_KEY env var");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

/**
 * Sends a push notification to a single device token.
 * @param {string} token - FCM device token
 * @param {string} title - Notification title
 * @param {string} [body] - Notification body
 * @param {Record<string, string>} [data] - Custom data payload
 */
export async function sendPushNotification(token, title, body, data = {}) {
  const message = {
    token,
    notification: { title, body },
    data,
    webpush: {
      notification: {
        icon: "/logo.png",
        vibrate: [200, 100, 200],
      },
      fcmOptions: {
        link: "/",
      },
    },
  };

  await admin.messaging().send(message);
}

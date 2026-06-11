/**
 * @file Firebase Cloud Messaging service worker (background push)
 * @description Handles incoming push notifications when the app is in the background.
 * @service Firebase Cloud Messaging (web push)
 */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");
importScripts("/firebase-config.js");

firebase.initializeApp(self.FIREBASE_CONFIG);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification?.title ?? "ivvazh", {
    body: payload.notification?.body,
    icon: "/logo.png",
  });
});

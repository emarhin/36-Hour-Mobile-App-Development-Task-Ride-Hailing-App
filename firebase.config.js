// export { analytics, app };
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCVUj-DeXfaBIJLhbgwcRUDHELji-4oR0",
  authDomain: "freelanceauth.firebaseapp.com",
  projectId: "freelanceauth",
  storageBucket: "freelanceauth.firebasestorage.app",
  messagingSenderId: "1048182628232",
  appId: "1:1048182628232:web:0de066dd1479e6a504e43d",
  measurementId: "G-JBR2K7RNJT",
};

// Ensure app isn't initialized more than once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firebase Analytics (conditionally initialized)
let analytics;
(async () => {
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
})();

export { analytics, app, auth };

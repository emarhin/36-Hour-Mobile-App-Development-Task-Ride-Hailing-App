# 36-Hour-Mobile-App-Development-Task-Ride-Hailing-App

A complete Firebase Email/Password Authentication flow in an Expo React Native app, featuring:

- ✅ Sign Up & Login with Firebase
- 👤 Basic User Profile (Name, Email, Phone)
- 🔁 Persistent login with `AsyncStorage`
- 🧼 Form validation & error handling

---

## 🛠 Tech Stack

- [Expo](https://expo.dev/)
- Firebase Authentication
- React Native + TypeScript
- `@react-native-async-storage/async-storage`
- (Optional) `react-hook-form` / `yup` for validation

---

## 🚀 Features

### 🔐 Authentication

- Email & Password Sign Up / Login
- Secure session management
- Firebase backend integration

### 👤 User Profile

- Displays:
  - Name
  - Email
  - Phone Number

### 🔁 Persistent Login

Uses Firebase Auth with `AsyncStorage` for login session persistence:

```ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

2. 🗺️ Map Integration & Location Services
   Interactive Map with user's current location

Permissions Handling using expo-location

Address Search (UI only)

Simulated Route Display between pickup and destination

Accurate GPS Centering on user's position

⚠️ Note to Reviewer:
Since Google Maps API key was not provided, route and address search were simulated using custom logic and mock data. This allows the app to function for demo purposes but is not ideal for production.

3. 🚖 Ride Booking Flow
   Pickup & Destination Selection via search or tapping map

Fare Estimation: Simulates distance, fare, and ETA

Vehicle Selection: Economy, Premium, SUV options

Booking Confirmation step with trip summary

Booking Status Updates:

Searching

Driver Assigned

En Route

Arrived

In Progress

Completed

4. 👨‍✈️ Driver Simulation
   Mock Driver Assignment after 2–5 seconds delay

Driver Info: Name, vehicle, rating, and image

Live Driver Tracking with simulated location updates

Mock Communication UI (Phone & Message buttons)

5. 📦 Trip Management
   Active Trip View: Displays current trip info & status

Trip History: Completed trip list with summary

Trip Details View: Fare, duration, route breakdown

Cancel Trip Option: With confirmation prompt

📦 Tech Stack
React Native with Expo

Firebase Authentication

@react-native-async-storage/async-storage

React Native Maps

Expo Location

Optional: yup / react-hook-form for validation

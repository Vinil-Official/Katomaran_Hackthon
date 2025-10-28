# 🌸 MyProject – React Native Expo App

## 📱 Overview
**MyProject** is a visually rich mobile application built using **React Native (Expo)** with **Firebase Authentication** and **Google Sign-In**.  
It provides a modern UI with smooth animations, background imagery, and robust authentication — ideal for journaling, mood tracking, or productivity workflows.

---

## ✨ Features
- 🔐 **Email & Password Authentication** (Firebase)
- 🔑 **Google Sign-In** using Expo AuthSession
- 🧭 **Expo Router Navigation**
- 💾 **SQLite Local Data Storage**
- 🌄 **Beautiful Unsplash Background Images**
- 📸 **Profile Image & UI Animations**
- 🎨 **Responsive Layout for All Devices**
- ⚡ **Optimized with React Native Reanimated**
- 💤 **Custom Splash Screen + Icons**

---

## 🛠️ Tech Stack

| Category | Tools / Libraries |
|-----------|------------------|
| **Framework** | Expo SDK 54, React Native 0.81.5 |
| **Navigation** | Expo Router, React Navigation |
| **Authentication** | Firebase Auth, Google OAuth 2.0 |
| **Storage** | SQLite, AsyncStorage |
| **UI / Animation** | Expo Image, Reanimated, Haptics, Status Bar |
| **Build Tool** | EAS Build |
| **Language** | JavaScript / TypeScript compatible |

---

## 🧩 Folder Structure
MyProject/
┣ app/
┃ ┣ HomeScreen.js
┃ ┣ RegisterPoint/
┃ ┃ ┣ Register.js
┃ ┃ ┗ Login.js
┃ ┣ Journey/
┃ ┃ ┗ JournalPage.js
┣ assets/
┃ ┣ images/
┣ Service/
┃ ┗ FireAuth.js
┣ package.json
┣ app.json
┣ eas.json
┗ README.md

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/MyProject.git
cd MyProject
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Start the Development Server
bash
Copy code
npx expo start
▶ Run on Android Emulator or Real Device
bash
Copy code
npx expo start --android
🌐 Run on Web
bash
Copy code
npx expo start --web
🔥 Firebase Setup
📁 Service/FireAuth.js

js
Copy code
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxx.firebaseapp.com",
  projectId: "xxxxxxxx",
  storageBucket: "xxxxxxxx.appspot.com",
  messagingSenderId: "xxxxxxxx",
  appId: "1:xxxxxxxx:web:xxxxxxxx",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default auth;
🔑 Google Sign-In Setup
Go to Google Cloud Console → Create OAuth 2.0 Credentials

Add both:

expoClientId

webClientId

Update them in your Google Sign-In configuration file.

🧱 EAS Build Commands
🧩 Configure EAS
bash
Copy code
npx eas build:configure
✅ Build an Installable APK (for Testing)
bash
Copy code
eas build -p android --profile preview
🚀 Build for Play Store (AAB Format)
bash
Copy code
eas build -p android --profile production
🧹 Clear Cache and Rebuild
bash
Copy code
eas build -p android --profile production --clear-cache
📦 After the Build
Expo provides a download link like:

bash
Copy code
✔ Build complete
🟢 Download your app: https://expo.dev/accounts/vinil916/projects/MyProject/builds/xxxxxx
➡️ Open that link → Download the .apk
➡️ Transfer it to your phone → Tap to install ✅

🌄 UI Preview
Screen	Description
🪷 Register	Elegant registration screen with animation
🔑 Login	Clean login layout
📔 Journal	Smooth scroll journaling interface

🌐 app.json Key Highlights
json
Copy code
{
  "expo": {
    "name": "MyProject",
    "slug": "MyProject",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myproject",
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png"
      },
      "package": "com.vinil916.MyProject"
    },
    "plugins": [
      "expo-router",
      "expo-splash-screen",
      "expo-sqlite",
      "expo-web-browser"
    ]
  }
}
🧠 Developer Notes
✅ Expo SDK 54 verified via expo-doctor
✅ expo-av updated to v16.0.7
✅ Compatible with react-native@0.81.5
✅ Built successfully using EAS Build Cloud
💻 Tested on Intel i7 8th Gen Laptop
📱 Installed on Android 12 Mobile Device

👨‍💻 Developer Info
Author: Vinil P
Project Type: Expo React Native App
Focus Areas: Firebase, Google Auth, UI Design, Mobile Development
Contact: (Add your GitHub or portfolio link here)

🏁 License
This project is open for personal and educational use only.
All third-party images and dependencies belong to their respective owners

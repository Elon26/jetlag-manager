# jetlag-manager

A commercial mobile application for task planning and time management across multiple time zones.  
The app helps users schedule meetings, track tasks in different regions, and manage personal data on the device.

> Commercial project. Published on the App Store under a different name by the client’s request (public link is not available).

---

## 🌍 About the Project

The project is designed for users who work or communicate across different time zones.  
It provides visual tools for comparing time zones, planning meetings and tasks, and managing personal data directly on the device.

The app focuses on smooth UI/UX, offline-first data storage, and performance on mobile devices.

---

## 🧰 Tech Stack

**Framework / Platform**
- React Native  
- TypeScript  

**State / Storage**
- react-native-mmkv (local storage, no backend)

**Infrastructure & Services**
- Firebase Storage
- Firebase Remote Config
- Sentry  
- Apphud  
- Facebook SDK  

**UI / UX**
- Tailwind (NativeWind)  
- react-native-reanimated  
- i18n (localization)

**Tooling**
- ESLint  
- Prettier  

---

## ✨ Key Features

- 🌐 Time zone management:
  - add multiple time zones  
  - visual comparison of time differences between regions  
- 📅 Task and meeting planning:
  - schedule tasks and meetings across different time zones  
  - calendar view  
  - push notifications for tasks and meetings  
- 🖼 Device cleanup:
  - detect low-quality photos  
  - find duplicate photos  
  - clean up storage directly from the app  
- 👥 Duplicate contacts detection:
  - find contacts with similar names  
  - find contacts with duplicate phone numbers  
  - remove duplicates from the device  
- 🔐 Secure local vault:
  - store images, videos, and contacts  
  - restrict access from other apps  
- 🔑 Password generator & manager:
  - synced with the system password storage  
- 🌐 Internet speed test:
  - measure current network speed on the device  
- 🔍 Search and filtering across multiple sections  
- 🎞 Smooth UI transitions and animated charts  
- 💾 Local-first data storage using MMKV (no backend)

---

## 👨‍💻 Role & Responsibilities

The project was implemented entirely by me:
- designed the application architecture;  
- implemented business logic and local data storage;  
- built complex UI with animations and charts;  
- integrated notifications and calendar features;  
- connected third-party services (analytics, crash reporting, monetization);  
- prepared the app for production release.

---

## 🧠 Challenges & Technical Decisions

- Optimized time zone search and filtering to ensure fast loading and smooth user experience.  
- Implemented a complex time zone slider with precise percentage-based mapping:
  - the slider controls multiple UI elements simultaneously;  
  - all related visualizations update smoothly and proportionally;  
- Designed animation logic so that charts and time indicators update in sync with user interactions.  
- Paid special attention to performance due to heavy UI animations and large data sets.

---

## 🚀 Local Setup

The project cannot be started without a .env file because it contains confidential keys and tokens.

Installation and run:

- npm install
- npm run start

---

## 🧪 Code Quality

- ESLint and Prettier are configured  
- No automated tests (manual QA by a dedicated tester)  
- Multiple environment variables are used for service configuration  

---

## 📌 Notes

This repository is intended to demonstrate architecture, UI complexity, and development approach.  
The production version is published in the App Store under a different name according to the client’s requirements.

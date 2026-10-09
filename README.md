# Jetlag & Time Zone Manager (Client App)

A modern, high-performance client application for task planning, scheduling, and time management across multiple international time zones.

---

## 🌍 About the Project

The application is designed for users who coordinate activities across different regions. It provides visual comparison tools, meeting planners, and multi-timezone scheduling interfaces.

The project focuses on complex UI interactions, precise data mapping, and smooth real-time visual updates.

---

## 🧰 Tech Stack

**Framework & Core**
- React Native / Component-Driven Architecture
- TypeScript

**State & Local Storage**
- react-native-mmkv (local-first storage, no backend)

**Infrastructure & Services**
- Firebase (Storage, Remote Config)
- Sentry, Apphud

**UI & Styling**
- Tailwind CSS (NativeWind)
- react-native-reanimated
- i18n (localization)

**Tooling**
- ESLint, Prettier

---

## ✨ Key Features & Highlights

- **Multi-Zone Management:** Add, configure, and visually compare time differences across multiple regions simultaneously.
- **Cross-Zone Planning:** Schedule tasks and meetings with integrated calendar views and automated time conversion.
- **Interactive Controls:** Precise slider mapping allowing users to control multiple time indicators and charts concurrently.
- **Advanced Filtering & Search:** Instant search and multi-section filtering across dense data sets.
- **Offline-First Architecture:** Fast local data persistence using MMKV without relying on a remote backend.
- **Monetization & Analytics:** Integrated subscriptions (Apphud), crash reporting (Sentry), and feature flags (Remote Config).

---

## 👨‍💻 Role & Engineering Contributions

- Designed and implemented the complete application architecture from scratch.
- Developed complex time conversion logic and synchronized interactive sliders.
- Built performance-optimized UI components capable of handling high-frequency state updates and heavy layout animations.
- Integrated third-party SDKs for analytics, monitoring, and in-app purchases.

---

## 🚀 Local Setup

Clone the repository and install dependencies to run the project locally:

```bash
# Clone the repository
git clone https://github.com/Elon26/jetlag-manager.git

# Install dependencies
npm install

# Run the project
npm run start

# Hive App 

This repository houses the Hive project — a smart dating and social web application for university students and young professionals, built with Vue 3, Firebase, and OpenAI.

---

## Executive Summary

Hive addresses rising social isolation by providing a platform where users can discover like-minded individuals and build genuine relationships. The system curates matches based on shared interests, conversation styles, and life goals, and uses AI to reduce the friction of starting meaningful conversations.

---

## Problem Statement

A 2024 study by IPS reported that 53% of young adults in Singapore experience social isolation, with many preferring online communication. Hive solves this by:
- Creating safe online spaces for authentic interaction
- Using machine learning to recommend compatible users
- Generating personalized conversation prompts via GPT-4

---

## Features

- Google Authentication (via Firebase)
- Guided multi-step onboarding
- Real-time swiping and match discovery
- AI-powered icebreaker suggestions
- Match streak and engagement tracking
- Likes and messages dashboard
- Privacy settings and profile customization
- Mobile responsiveness and smooth UX

---

## Target Users

1. **University Students**  
   - Make friends or find partners through filtered connections based on interests or school

2. **Young Working Adults**  
   - Save time by filtering potential matches by dating goals, lifestyle, or industry

---

## Tech Stack

**Frontend**: Vue 3, Vite, Chart.js  
**Backend & Cloud**: Firebase (Auth, Firestore, Storage), OpenAI (GPT-4), Google Analytics

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/BT3103AppDev1/l2-finaltermproject-2425s2l2_group_23.git
cd hive-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

---

## Firebase Configuration

Ensure your Firebase project is set up in `firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

- Enable Google Sign-In in Firebase Console  
- Create Firestore collections: `users`, `matches`, `chats`  
- Set up Firebase Storage for profile image uploads

---

## GPT-4 Integration

Hive uses GPT-4 via OpenAI API to:
- Suggest personalized icebreakers
- Generate smart, context-aware replies
- Encourage engaging, low-pressure conversation flow

---

## App Navigation Structure

```
Authentication:
  /login, /register, /reset-password

Onboarding:
  /new-user1 → /new-user4

Main App:
  /home          # Likes tally, match streak
  /connect       # Filtered match discovery
  /messages      # Chat interface with GPT-4 prompts
  /mybuzzes      # Incoming likes list
  /myaccount     # Profile and preferences
  /notifications # Alerts and interactions
  /privacy       # Manage blocked users
  /logout        # Confirmed sign-out
```

---

## File Structure

```
src/
├── App.vue
├── firebase.js
├── gpt.mjs
├── router/index.js
├── components/
├── views/
```

---

## Functional Highlights

- Authentication and profile setup with interest tagging
- Smart filters (school, lifestyle, goals, etc.)
- Real-time messaging system with stickers/media
- Match streaks and visualizations using Chart.js
- AI-assisted conversation suggestions
- Full privacy control with block/unblock and deletion

---

## Limitations

- Cold start problem in early data collection
- Dependent on Firebase uptime and third-party APIs
- Matching improves with user base growth (network effect)

---

## Future Roadmap

- SwarmSpace: Location-based user discovery using Google Maps API
- Availability Scheduling: Let users set when they're open to chat or meet
- Mobile-first enhancements and push notifications

---

## Scrum & Agile Methodology

- Sprint-based workflow using SCRUM
- Product Backlog → Sprint Planning → Daily Standups → Sprint Review
- Strict adherence to Definition of Done:
  - Completed functionality
  - Peer-reviewed and merged into main branch
  - Functional demo and updated documentation

---

## Deployment

The Hive app is deployed using Firebase Hosting.

To deploy your own version:

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase

```bash
firebase init
```

### 4. Build the App

```bash
npm run build
```

### 5. Deploy

```bash
firebase deploy
```

Ensure your `firebase.json` and `/dist` folder are configured correctly.

Live Site: [https://hive-1d75b.web.app](https://hive-1d75b.web.app)

---

## Test Credentials

- **Email:** testuser@test.com  
- **Password:** 123456

---

## Contributors

- Ethan Ong  
- Lim Jia Weng  
- Joshua Chen  
- Neo Peng Rong  
- Santtosh Mohan

---

## Acknowledgements

- BT3103 Application Systems Development (NUS)  
- Prof. Shashank for product guidance and Scrum integration

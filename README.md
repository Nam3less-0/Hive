# Hive App 
---
![image](https://github.com/user-attachments/assets/4ac16cad-2c70-4b9d-8733-345b3906b71d)

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
![image](https://github.com/user-attachments/assets/8eea42cc-4bd4-413f-9811-b1e0150f536e)

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

## Scrum & Agile Methodology

The Hive team followed the **Scrum framework** to manage development efficiently across two sprints and a preparatory phase. Roles were clearly defined, and progress was tracked with daily standups, backlog grooming, and sprint reviews.

Final product development differed from the midterm submission as the MVP was completed before the Scrum lecture and final report guidelines. To adhere to Scrum methodology, the team restructured features and planning accordingly to enable proper documentation.

---

### Pre-Sprint: MVP Development (22 Feb – 2 Mar 2025)

**Sprint Goal**: Deliver a working MVP demonstrating routing, core flows, and basic Firebase integration.

**Key Deliverables**:
- User authentication (Login/Register)
- Onboarding flow across 5 user input pages
- Initial Home Page with likes and streaks count
- Navigation bar and page routing (Connect, Messages, MyBuzzes, Profile)
- Basic Connect Page profile display (photo, bio, age, interests)
- Messages Page layout with ChatList and ChatRoom
- MyBuzzes with like/pass logic
- Profile Page with editable user sections
- Notification and Privacy placeholders

**Highlights**:
- 96% task completion (24/25 points)
- All acceptance criteria validated except 1 (notification settings – carried over to Sprint 1)
- Built the foundation for Firebase integration and front-end architecture

---

### Sprint 1: Core Features & ML Matching (21 Mar – 3 Apr 2025)

**Sprint Goal**: Extend MVP with core features — Google Authentication, Connect Page logic, collaborative filtering, and UI polish.

**Key Deliverables**:
- Google Login/Registration with error handling and Firebase user tracking
- Likes/streaks summary on Home Page
- Filter pop-up with age, interest, and demographic controls
- Machine Learning-based matching (cosine similarity)
- “No More Users” fallback screen with visuals
- UI animations and pass/like logic refinement

**Highlights**:
- 98% task completion (46/47 points)
- Collaborative filtering implemented and tested
- Nearly all user stories met the Definition of Done
- Improved internal communication through biweekly check-ins

---

### Sprint 2: UI/UX Refinement & Messaging System (4–17 Apr 2025)

**Sprint Goal**: Finalize backlog features, improve UX consistency, and complete backend data flows.

**Key Deliverables**:
- Full messaging system (ChatList, ChatRoom, reply input, GPT suggestions)
- Profile viewing pop-ups with full info across Connect and Buzzes
- MatchChart and LikesChart using Chart.js
- Secure password reset, logout, and notification toggle flows
- Profile edit, block user, and account deletion logic

**Highlights**:
- 98% task completion (81/82 points)
- Completed "Sweet Conversation Starter" feature (GPT-4)
- Seamless navigation across devices and views
- Greater alignment to DoD and improved UI cohesion

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

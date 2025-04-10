<template>
  <div class="layout">
    <Sidebar />

    <main class="privacy-content">
      <section class="content-container">
        <h2>Privacy</h2>

        <h3>Blocked Profiles</h3>

        <div v-if="blockedProfiles.length > 0">
          <div class="blocked-profile" v-for="profile in blockedProfiles" :key="profile.id">
            <img :src="profile.img" :alt="profile.name" class="profile-image">
            <div class="profile-info">
              <strong>{{ profile.name }}</strong>
              <p class="blocked-date">Blocked on {{ profile.date }}</p>
              <button class="undo-btn" @click="unblockUser(profile.id)">Undo</button>
            </div>
          </div>
        </div>

        <p v-else>No blocked profiles.</p>
      </section>
    </main>
  </div>
  <div v-if="showNotification" class="notification-toast" :class="notificationType">
  {{ notificationMessage }}
  <div class="progress-bar"></div>
</div>
</template>

<script setup>

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("success");

const triggerNotification = (message, type = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
};
import { ref, onMounted } from 'vue';
import { db, auth } from '@/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar.vue';

const blockedProfiles = ref([]);

// 🔹 Function to fetch blocked profiles
async function fetchBlockedProfiles() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    // Get the current user's document
    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error("User document not found.");
      return;
    }

    // Retrieve the blocked user IDs array
    const blockedUserIds = userDocSnap.data().blocked || [];
    if (blockedUserIds.length === 0) {
      blockedProfiles.value = []; // No blocked users
      return;
    }

    // Fetch details of each blocked user
    const profilePromises = blockedUserIds.map(async (blockedUserId) => {
      const blockedUserDocRef = doc(db, `users/${blockedUserId}`);
      const blockedUserDocSnap = await getDoc(blockedUserDocRef);

      if (!blockedUserDocSnap.exists()) return null;

      const blockedUserData = blockedUserDocSnap.data();

      return {
        id: blockedUserId,
        name: `${blockedUserData.firstName} ${blockedUserData.lastName}`,
        img: blockedUserData.images?.[0] || "https://via.placeholder.com/150",
        date: new Date().toLocaleDateString(), // Placeholder date (you may need to fetch real blocked date)
      };
    });

    // Resolve all promises and update the UI
    blockedProfiles.value = (await Promise.all(profilePromises)).filter(profile => profile !== null);

  } catch (error) {
    console.error("Error fetching blocked profiles:", error);
  }
}

// 🔹 Function to unblock a user
async function unblockUser(blockedUserId) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) return;

    let updatedBlockedList = userDocSnap.data().blocked || [];

    // Remove the user from the blocked list
    updatedBlockedList = updatedBlockedList.filter(id => id !== blockedUserId);

    // Update Firestore
    await updateDoc(userDocRef, { blocked: updatedBlockedList });

    const matchesRef = collection(db, "matches");
    const matchesQuery = query(
      matchesRef,
      where("userIds", "array-contains", user.uid) // Check if the current user is part of the match
    );

    const querySnapshot = await getDocs(matchesQuery);

    for (const matchDoc of querySnapshot.docs) {
      const matchData = matchDoc.data();

      // Check if the match includes both users
      if (matchData.userIds.includes(blockedUserId)) {
        // Update match document to set blocked = false
        await updateDoc(doc(db, `matches/${matchDoc.id}`), { blocked: false });
      }
    }
    // Update UI
    blockedProfiles.value = blockedProfiles.value.filter(profile => profile.id !== blockedUserId);

    triggerNotification("User unblocked successfully!", "success");
  } catch (error) {
    console.error("Error unblocking user:", error);
  }
}

// Fetch blocked profiles when the component is mounted
onMounted(fetchBlockedProfiles);
</script>

<style scoped>
.layout {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background-color: #fafafa;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.privacy-content {
  flex-grow: 1;
  padding: 30px;
  margin: 30px;
  box-sizing: border-box;
}

.content-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 25px;
}

h2, h3 {
  margin-bottom: 20px;
}

.blocked-profile {
  display: flex;
  align-items: center;
  background: #fdfdfd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.undo-btn {
  background: #ffe96b;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
}

.undo-btn:hover {
  opacity: 0.8;
}

.blocked-date {
  color: #888;
  font-size: 0.85rem;
}
h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  overflow: hidden;
  z-index: 9999;
}

.notification-toast.success .progress-bar {
  background-color: rgba(0, 255, 51, 0.7);
}

.notification-toast.error .progress-bar {
  background-color: rgb(237, 0, 0);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  animation: progressShrink 2s linear forwards;
}

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}
</style>

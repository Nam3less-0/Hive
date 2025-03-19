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
</template>

<script setup>
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

    alert("User unblocked successfully!");
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
</style>

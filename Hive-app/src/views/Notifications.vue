<template>
    <div class="layout">
      <Sidebar />
  
      <main class="notifications-content">
        <h2>Notifications Settings</h2>
  
        <section class="notification-section">
          <table class="notification-table">
            <thead>
              <tr>
                <th>Notification</th>
                <th>Email</th>
                <th>Push</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in notificationOptions" :key="index">
                <td>{{ item.label }}</td>
                <td>
                  <input type="checkbox" v-model="item.email" />
                </td>
                <td>
                  <input type="checkbox" v-model="item.push" />
                </td>
              </tr>
            </tbody>
          </table>
  
          <button class="save-btn" @click="saveNotificationSettings">Save Settings</button>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { db, auth } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

// Reactive list of notification settings
const notificationOptions = ref([
  { label: 'New likes', email: false, push: false },
  { label: 'New matches', email: false, push: false },
  { label: 'New messages', email: false, push: false }
]);

// 🔹 Fetch user's notification settings from Firestore
async function fetchNotificationSettings() {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    
    if (userData.notifications) {
      notificationOptions.value = notificationOptions.value.map(option => ({
        ...option,
        email: userData.notifications[option.label]?.email ?? false,
        push: userData.notifications[option.label]?.push ?? false
      }));
    }
  }
}

// 🔹 Save updated notification settings to Firestore
async function saveNotificationSettings() {
  const user = auth.currentUser;
  if (!user) return alert("Please log in to save settings.");

  const userDocRef = doc(db, "users", user.uid);

  const updatedSettings = {};
  notificationOptions.value.forEach(option => {
    updatedSettings[option.label] = {
      email: option.email,
      push: option.push
    };
  });

  try {
    await updateDoc(userDocRef, { notifications: updatedSettings });
    alert('Notification settings saved successfully!');
  } catch (error) {
    console.error("Error saving notification settings:", error);
    alert("Failed to save settings.");
  }
}

// Fetch data when component loads
onMounted(fetchNotificationSettings);
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
  
  .notifications-content {
    flex-grow: 1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 30px;
    margin-bottom: 25px;
  }
  
  .notification-section {
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .notification-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .notification-table th {
    text-align: left;
    padding: 10px;
    border-bottom: 2px solid #ccc;
    font-size: 1.1rem;
  }
  
  .notification-table td {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-table input[type="checkbox"] {
    accent-color: #ffe96b; /* matching your UI yellow */
    width: 18px;
    height: 18px;
  }
  
  .save-btn {
    background-color: #ffe96b;
    color: black;
    padding: 10px 15px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .save-btn:hover {
    opacity: 0.9;
  }
  </style>
  
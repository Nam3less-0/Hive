<template>
  <div class="layout">
    <Sidebar />

    <main class="notifications-content">
      <h2>Notifications Settings</h2>
      <p class="description">
       
      </p>

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
              <td :data-label="'Notification'">{{ item.label }}</td>
              <td :data-label="'Email'">
                <input type="checkbox" class="toggle-switch" v-model="item.email" />
              </td>
              <td :data-label="'Push'">
                <input type="checkbox" class="toggle-switch" v-model="item.push" />
              </td>
            </tr>
          </tbody>
        </table>

        <button class="save-btn" @click="saveNotificationSettings">Save Settings</button>
      </section>
    </main>
  </div>

  <div v-if="showNotification" class="notification-toast" :class="[notificationType, { show: showNotification }]">
    {{ notificationMessage }}
    <div class="progress-bar"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { db, auth } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const showNotification = ref(false)
const notificationMessage = ref("")
const notificationType = ref("success")

const triggerNotification = (message, type) => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true

  setTimeout(() => {
    showNotification.value = false
  }, 2000)
}

const notificationOptions = ref([
  { label: 'New likes', email: false, push: false },
  { label: 'New matches', email: false, push: false },
  { label: 'New messages', email: false, push: false }
])

async function fetchNotificationSettings() {
  const user = auth.currentUser
  if (!user) return

  const userDocRef = doc(db, "users", user.uid)
  const userDocSnap = await getDoc(userDocRef)

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data()
    if (userData.notifications) {
      notificationOptions.value = notificationOptions.value.map(option => ({
        ...option,
        email: userData.notifications[option.label]?.email ?? false,
        push: userData.notifications[option.label]?.push ?? false
      }))
    }
  }
}

async function saveNotificationSettings() {
  const user = auth.currentUser
  if (!user) return triggerNotification("Please log in to save settings.", "error")

  const userDocRef = doc(db, "users", user.uid)
  const updatedSettings = {}

  notificationOptions.value.forEach(option => {
    updatedSettings[option.label] = {
      email: option.email,
      push: option.push
    }
  })

  try {
    await updateDoc(userDocRef, { notifications: updatedSettings })
    triggerNotification('Notification settings saved successfully!', "success")
  } catch (error) {
    console.error("Error saving notification settings:", error)
    triggerNotification("Failed to save settings.", "error")
  }
}

onMounted(fetchNotificationSettings)
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

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 20px;
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
  width: 18px;
  height: 18px;
}

/* Toggle Switch */
.toggle-switch {
  appearance: none;
  width: 42px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  display: inline-block;
  vertical-align: middle;
  border: none;
  padding: 0;
}

.toggle-switch::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top:-1px;
  left: -4px;
  transition: transform 0.25s ease-in-out;
}

.toggle-switch:checked {
  background-color: #ffe96b;
}

.toggle-switch:checked::before {
  transform: translateX(15px); /* 42 - 20 - 2*2 padding */
}

.save-btn {
  position: sticky;
  bottom: 10px;
  background-color: #ffe96b;
  color: black;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.save-btn:hover {
  opacity: 0.9;
}

/* Notification Toast */
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
  opacity: 0;
  transform: translateY(-20px);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.notification-toast.show {
  opacity: 1;
  transform: translateY(0);
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

/* Responsive Table for Mobile */
@media (max-width: 600px) {
  .notification-table thead {
    display: none;
  }

  .notification-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
  }

  .notification-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
  }

  .notification-table td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 10px;
  }
}
</style>
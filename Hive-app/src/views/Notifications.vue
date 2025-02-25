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
  import { reactive } from 'vue'
  import Sidebar from '@/components/Sidebar.vue'
  
  const notificationOptions = reactive([
    { label: 'New likes', email: true, push: true },
    { label: 'New matches', email: true, push: true },
    { label: 'New messages', email: true, push: true },
  ])
  
  function saveNotificationSettings() {
    const settings = notificationOptions.map(option => ({
      notification: option.label,
      email: option.email,
      push: option.push
    }))
    
    console.log('Saved notification settings:', settings)
    alert('Notification settings saved successfully!')
  }
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
  
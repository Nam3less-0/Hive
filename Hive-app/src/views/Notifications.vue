<template>
    <div class="notifications-container">
      <div class="sidebar">
        <div class="sidebar-box"> <!-- 👈 new box wrapper -->
          <div class="sidebar-header">
            <div class="greeting">Hi, Santtosh Mohan!</div>
            <div class="profile-label">Your Profile</div>
        <ul>
          <li :class="{ active: $route.name === 'MyAccount' }" @click="navigateTo('MyAccount')">My Account</li>
          <li :class="{ active: $route.name === 'Notifications' }" @click="navigateTo('Notifications')">Notifications</li>
          <li :class="{ active: $route.name === 'Privacy' }" @click="navigateTo('Privacy')">Privacy</li>
          <li @click="logout">Log Out</li>
        </ul>
      </div>
      </div>
      </div>
  
      <!-- Notification Content -->
      <div class="notifications-content">
        <h2>Notification Settings</h2>
        <table class="notification-table">
          <thead>
            <tr>
              <th>Notification</th>
              <th>Email</th>
              <th>Push</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>New likes</td>
              <td><input type="checkbox" v-model="notifications.likes.email"></td>
              <td><input type="checkbox" v-model="notifications.likes.push"></td>
            </tr>
            <tr>
              <td>New matches</td>
              <td><input type="checkbox" v-model="notifications.matches.email"></td>
              <td><input type="checkbox" v-model="notifications.matches.push"></td>
            </tr>
            <tr>
              <td>New messages</td>
              <td><input type="checkbox" v-model="notifications.messages.email"></td>
              <td><input type="checkbox" v-model="notifications.messages.push"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { auth } from '@/firebase';
  import { useRouter } from 'vue-router';
  import { reactive } from 'vue';
  
  export default {
    setup() {
      const router = useRouter();
  
      const navigateTo = (pageName) => {
        router.push({ name: pageName });
      };
  
      const logout = () => {
        auth.signOut().then(() => {
          router.push({ name: 'Login' });
        });
      };
  
      // Dummy data structure for checkbox states
      const notifications = reactive({
        likes: { email: true, push: true },
        matches: { email: false, push: true },
        messages: { email: true, push: true },
      });
  
      return {
        navigateTo,
        logout,
        notifications,
      };
    },
  };
  </script>
  
  <style scoped>
  .notifications-container {
    display: flex;
    min-height: calc(100vh - 60px); /* Adjust as needed */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .sidebar {
    width: 450px;
    padding: 20px;
  }
  
  .sidebar-box { /* 👈 new box styling */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    padding: 20px;
    background: white;
    border: 1px solid #ddd;
  }
  
  .sidebar-header {
    margin-bottom: 10px;
  }
  
  .sidebar .greeting {
    color: #888;
    font-size: 0.9rem;
  }
  
  .sidebar .profile-label {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar ul li {
    padding: 10px;
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 8px;
  }
  
  .sidebar ul li.active,
  .sidebar ul li:hover {
    background: #ffe96b;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  
  .notifications-content {
    flex-grow: 1;
    padding: 40px;
    overflow-y: auto;
  }
  
  .notification-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .notification-table th,
  .notification-table td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }
  
  .notification-table th {
    font-weight: bold;
  }
  </style>
  
  
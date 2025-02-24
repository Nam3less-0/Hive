<template>
    <div class="app-container">
      <nav class="navbar">
        <div class="navbar-left">
          <router-link to="/home" class="nav-logo">
            <img src="@/assets/hive-logo2.png" alt="HIVE Logo" />
          </router-link>
        </div>
  
        <div class="navbar-center">
          <router-link to="/connect" class="nav-link" :class="{ active: isActive('/connect') }">
            <img src="@/assets/connect-logo.png" alt="Connect" />
            Connect
          </router-link>
          <router-link to="/messages" class="nav-link" :class="{ active: isActive('/messages') }">
            <img src="@/assets/messages-logo.png" alt="Messages" />
            Messages
          </router-link>
          <router-link to="/mybuzzes" class="nav-link" :class="{ active: isActive('/mybuzzes') }">
            <img src="@/assets/mybuzzes-logo.png" alt="MyBuzzes" />
            MyBuzzes
          </router-link>
        </div>
  
        <div class="navbar-right">
          <router-link to="/myaccount" class="nav-profile">
            <img src="@/assets/profile-logo.png" alt="Profile" />
            <span>Santtosh</span>
          </router-link>
        </div>
      </nav>
  
      <main class="content-area">
        <router-view /> <!-- renders page-specific content -->
      </main>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const isActive = (path) => route.path.startsWith(path);
  </script>
  
  <style scoped>
  html, body {
    margin: 0;
    padding: 0;
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
  
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffd400;
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-left img {
    height: 40px;
    cursor: pointer;
  }
  
  .navbar-center {
    display: flex;
    gap: 40px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #000;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 20px;
    transition: background-color 0.3s ease;
  }
  
  .nav-link img {
    height: 24px;
  }
  
  .nav-link.active {
    background-color: #ffbd59;
  }
  
  .nav-link:hover {
    background-color: orange;
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .nav-profile {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #000;
    font-weight: bold;
  }
  
  .nav-profile img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-color: #FFD400;
    padding: 5px;
  }
  
  .content-area {
    flex-grow: 1;
    padding: 20px;
    background-color: #f9f9f9;
    overflow-y: auto;
    box-sizing: border-box;
  }
  </style>
  
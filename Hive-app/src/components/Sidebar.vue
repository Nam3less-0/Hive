<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import HoneycombImg from '@/assets/image.png' // 👈 Correct import from assets

const router = useRouter()
const showLogoutConfirm = ref(false)

function confirmLogout() {
  showLogoutConfirm.value = true
}

function logout() {
  auth.signOut().then(() => {
    showLogoutConfirm.value = false
    router.push({ name: 'Login' })
  })
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="greeting">Hi, Santtosh Mohan!</div>
      <div class="profile-label">Your Profile</div>
    </div>
    <ul>
      <li><router-link to="/myaccount" active-class="active">My Account</router-link></li>
      <li><router-link to="/notifications" active-class="active">Notifications</router-link></li>
      <li><router-link to="/privacy" active-class="active">Privacy</router-link></li>
      <li><a @click.prevent="confirmLogout" href="#">Log Out</a></li>
    </ul>

    <div class="modal-overlay" v-if="showLogoutConfirm">
      <div class="logout-modal" :style="{ backgroundImage: `url(${HoneycombImg})` }"> <!-- 👈 Bind here -->
        <button class="close-btn" @click="showLogoutConfirm = false">×</button>
        <h2>Confirm log out?</h2>
        <div class="button-group">
          <button class="cancel-btn" @click="showLogoutConfirm = false">Cancel</button>
          <button class="confirm-btn" @click="logout">Confirm</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  padding: 20px;
  width: 250px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
  margin: 30px;
  box-sizing: border-box;
}

.sidebar-header {
  margin-bottom: 15px;
}

.sidebar .greeting {
  color: #888;
  font-size: 0.9rem;
}

.sidebar .profile-label {
  font-size: 1.1rem;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar ul li a.active,
.sidebar ul li a:hover {
  background: #ffe96b;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.logout-modal {
  background-size: cover;
  background-position: center;
  padding: 50px 80px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  text-align: center;
  position: relative;
  width: 600px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logout-modal h2 {
  margin-bottom: 30px;
  font-size: 2rem;
  color: #333;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.cancel-btn, .confirm-btn {
  padding: 12px 24px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
  font-size: 1rem;
}

.cancel-btn {
  background-color: #f2f2f2;
}

.confirm-btn {
  background-color: #f4a261;
  color: white;
}

.cancel-btn:hover {
  background-color: #ddd;
}

.confirm-btn:hover {
  background-color: #e76f51;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: none;
  font-size: 2rem;
  cursor: pointer;
  color: #555;
}

.close-btn:hover {
  color: #e76f51;
}
</style>

  
  
  
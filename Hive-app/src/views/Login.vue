<template>
  <div class="login-container">
    <!-- Reusable Branding Component -->
    <Branding />

    <!-- Right Section: Login Form -->
    <div class="login-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>
      
      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter your password" required />

        <button type="submit">Sign In</button>
      </form>

      <div class="links">
        <a @click="goToReset">Forgot password?</a>
        <a @click="goToRegister">Sign up</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import Branding from '@/components/Branding.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToRegister = () => {
  router.push('/register');
};

const goToReset = () => {
  router.push('/reset-password');
};

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('User signed in:', userCredential.user);
    alert("Successfully Logged In")
    router.push({name: "Home"})
    // You can redirect the user or perform additional actions here
  } catch (error) {
    console.error('Error signing in:', error.message);
    // Optionally, handle error feedback for the user here
  }
};

</script>

<style scoped>
.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-form {
  flex-grow: 1;
  width: 50vw !important;
  max-width: 50vw;
  min-width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  height: 100vh;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.logo-small img {
  width: 60px;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 25vw;
}

label {
  font-weight: bold;
  color: rgb(156, 156, 156);
  margin-top: 10px;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  box-sizing: border-box;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-sizing: border-box;
}

button:hover {
  background: #333;
}

.links {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 25vw;
  margin-top: 20px;
  font-size: 14px;
}

.links a {
  text-decoration: none;
  color: black;
}

.links a:hover {
  text-decoration: underline;
}
</style>

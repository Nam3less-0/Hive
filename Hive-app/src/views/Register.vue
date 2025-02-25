<template>
  <div class="login-container">
    <!-- Reusable Branding Component -->
    <Branding />

    <!-- Right Section: Register Form -->
    <div class="login-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>

      <form @submit.prevent="handleRegister">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
        />

        <label>Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
        />

        <button type="submit">Register</button>
      </form>

      <div class="links">
        <router-link to="/login">Already have an account? Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import Branding from '@/components/Branding.vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

const handleRegister = async () => {
  // Password length check
  if (password.value.length < 6) {
    console.error('Password must be at least 6 characters long');
    alert('Password must be at least 6 characters long');
    return;
  }

  // Confirm password match check
  if (password.value !== confirmPassword.value) {
    console.error('Passwords do not match');
    alert('Passwords do not match');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    console.log('User registered:', userCredential.user);
    // Redirect the user to Home (or another page) after registration.
    router.push({ name: 'NewUserPage1' });
  } catch (error) {
    console.error('Error registering:', error.message);
    alert(error.message);
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
  margin-top: 20px;
  padding: 12px;
  width: 100%;
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
  justify-content: center;
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

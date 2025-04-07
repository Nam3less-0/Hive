<template>
  <div class="login-container">
    <Branding />
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

        <button type="submit" class="auth-button primary">
          <img src="https://fonts.gstatic.com/s/i/materialiconsoutlined/mail/v15/24px.svg" class="icon" />
          Register with Email
        </button>
      </form>

      <!-- Google Sign-Up -->
      <div class="button-container">
        <button @click="handleGoogleRegister" class="auth-button google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" class="google-icon" />
          Register with Google
        </button>
      </div>

      <p v-if="userMessage" class="alert">{{ userMessage }}</p>

      <div class="links">
        <router-link to="/login">Already have an account? Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogleForRegister, logOut } from '@/firebase';
import Branding from '@/components/Branding.vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

const handleRegister = async () => {
  userMessage.value = '';

  if (password.value !== confirmPassword.value) {
    userMessage.value = "Passwords do not match.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log('User registered:', userCredential.user);
    router.push({ name: 'NewUserPage1' });
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        userMessage.value = "An account already exists with this email.";
        break;
      case "auth/invalid-email":
        userMessage.value = "Invalid email address format.";
        break;
      case "auth/weak-password":
        userMessage.value = "Password must be at least 6 characters long.";
        break;
      case "auth/operation-not-allowed":
        userMessage.value = "Email/password accounts are not enabled.";
        break;
      case "auth/network-request-failed":
        userMessage.value = "Network error. Please check your connection.";
        break;
      case "auth/internal-error":
        userMessage.value = "Something went wrong. Please try again later.";
        break;
      default:
        userMessage.value = "An unexpected error occurred. Please try again.";
    }
  }
};

const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });
});

const userMessage = ref('');

const handleGoogleRegister = async () => {
  const { user, exists } = await signInWithGoogleForRegister();

  if (user && !exists) {
    router.push({ name: 'NewUserPage1' });
  } else if (exists && !user) {
    userMessage.value = "An account already exists with this Google email.";
  } else {
    userMessage.value = "Google registration failed. Please try again.";
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  font-family: inherit;
}

label {
  font-weight: bold;
  color: black;
  margin-top: 10px;
  font-family: inherit;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
}

.auth-button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
  transition: background 0.3s ease;
}

.auth-button.primary {
  background: white;
  color: black;
  border: 1px solid #ccc;
}

.auth-button.primary:hover {
  background: #ffe96b;
  color: white;
}

.auth-button.google {
  background-color: white;
  color: black;
  border: 1px solid #ccc;
}

.auth-button.google:hover {
  background-color: #ffe96b;
  color: white;
}

.google-icon {
  width: 18px;
  height: 18px;
}

.button-container {
  width: 100%;
  max-width: 25vw;
}

.links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 25vw;
  margin-top: 20px;
  font-size: 14px;
  font-family: inherit;
}

.links a {
  text-decoration: none;
  color: black;
}

.links a:hover {
  text-decoration: underline;
}

.alert {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  font-family: inherit;
}
</style>



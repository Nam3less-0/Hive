<template>
  <div class="login-container">
    <Branding />

    <div class="login-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>
      
      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter your password" required />

        <button type="submit" class="auth-button primary">
          <img src="https://fonts.gstatic.com/s/i/materialiconsoutlined/mail/v15/24px.svg" class="icon" />
            Log In with Email
        </button>

      </form>

      <!-- Google Sign In Button -->
      <div class="button-container">
        <button @click="handleGoogleSignIn" class="auth-button google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" class="google-icon" />
          Log In with Google
        </button>
      </div>

      <p v-if="userMessage" class="alert">{{ userMessage }}</p>

      <div class="links">
        <a @click="goToReset">Forgot password?</a>
        <a @click="goToRegister">Sign up</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, logOut, signInWithGoogleForLogin } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';
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
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      console.log("Redirecting to new user page");
      router.push({ name: "NewUserPage1" });
      return;
    }

    console.log('User signed in:', userCredential.user);
    router.push({ name: "LoadingPage" });
  } catch (error) {
  switch (error.code) {
    case "auth/user-not-found":
    case "auth/invalid-credential":
      userMessage.value = "No account found for this Email. Please register first.";
      break;
    case "auth/wrong-password":
      userMessage.value = "Invalid password. Please try again.";
      break;
    case "auth/invalid-email":
      userMessage.value = "Invalid email address format.";
      break;
    case "auth/user-disabled":
      userMessage.value = "This account has been disabled.";
      break;
    case "auth/too-many-requests":
      userMessage.value = "Too many login attempts. Please try again later.";
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

const handleGoogleSignIn = async () => {
  const { user, exists } = await signInWithGoogleForLogin();

  if (user && exists) {
    router.push({ name: 'Home' });
  } else {
    userMessage.value = "No account found for this Google email. Please register first.";
  }
};

const handleLogOut = async () => {
  await logOut();
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
}

label {
  font-weight: bold;
  color: black;
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
  background:  white;
  color: black;
  border: 1px solid #ccc; 
}

.auth-button.primary:hover {
  background:  #ffe96b;
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

.alert {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>

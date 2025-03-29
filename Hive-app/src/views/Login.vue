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

        <button type="submit">Log In</button>
      </form>

      <!-- Google Sign In Button -->
      <div class="button-container">
        <button @click="handleGoogleSignIn" class="google-btn">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google logo" class="google-icon" />
          Log in with Google
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
    const user = userCredential.user
     /*if (!user.emailVerified) {
      alert("Email not verified.");
      return;
    }*/

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      console.log("Redirecting to new user page");
      router.push({ name: "NewUserPage1" });
      return;
    }

    console.log('User signed in:', userCredential.user);
    router.push({name: "LoadingPage"})
    // You can redirect the user or perform additional actions here
  } catch (error) {
    console.error('Error signing in:', error.message);
    alert('Error signing in: ' + error.message)
    // Optionally, handle error feedback for the user here
  }
};

const user = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
  })
})

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
  await logOut()
}
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

label {
  font-weight: bold;
  color: rgb(156, 156, 156);
  margin-top: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button:hover {
  background: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* Center text and icon */
  gap: 10px;
  width: 100%; /* Match width of the Login button */
  max-width: 300px; /* Set max width to match login button */
  padding: 10px;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.google-btn:hover {
  background-color: #357ae8;
}

.google-icon {
  width: 18px; /* Adjust icon size */
  height: 18px;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 300px; /* Match login and register button */
}


.alert {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}

</style>

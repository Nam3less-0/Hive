<template>
  <div class="reset-container">
    <Branding />

    <div class="reset-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>

      <form @submit.prevent="handleReset">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter your email" required />

        <!-- Button container with align-right reset -->
        <div class="button-group">
          <button type="button" class="btn-cancel" @click="handleCancel">Cancel</button>
          <button type="submit" class="btn-reset">Reset Password</button>
        </div>

        <div v-if="message" :class="['feedback', messageType]">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase';
import Branding from '@/components/Branding.vue';
import { useRouter } from 'vue-router';

const email = ref('');
const message = ref('');
const messageType = ref('');
const router = useRouter();

const handleReset = async () => {
  message.value = '';

  try {
    await sendPasswordResetEmail(auth, email.value);
  } catch (error) {
    console.error('Error sending reset email:', error.message);
  }

  message.value = "If an account with that email exists, a password reset link has been sent.";

  setTimeout(() => {
    router.push('/');
  }, 3000);
};


const handleCancel = () => {
  router.push('/');
};
</script>

<style scoped>
.reset-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.reset-form {
  flex-grow: 1;
  width: 50vw;
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
  max-width: 350px;
}

label {
  font-weight: bold;
  color: black;
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
}

/* Button group — aligns Reset Password to the right */
.button-group {
  display: flex;
  justify-content: space-between;  /* distribute left/right */
  margin-top: 12px;
  width: 100%;
  max-width: 350px;
  padding: 0;
  box-sizing: border-box;
}

button[type="button"],
button[type="submit"] {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button[type="button"] {
  background: red;
  color: black;
  /* REMOVE margin-right or auto! */
}

button[type="submit"] {
  background: #ffe96b;
  color: black;
  /* REMOVE margin-left or auto! */
}


.btn-cancel {
  background: red;
  color: black;
}

.btn-cancel:hover {
  color: white;
}

.btn-reset {
  background: #ffe96b;
  color: black;
}

.btn-reset:hover {
  color: white;
}

.feedback {
  margin-top: 5px;
  padding: 5px 12px;
  background-color: #ffe6e6;
  border: 1px solid #ff8080;
  border-radius: 8px;
  color: red;
  font-weight: bold;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>


  
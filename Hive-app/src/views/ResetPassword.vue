<template>
    <div class="reset-container">
      <!-- Reusable Branding Component (left side) -->
      <Branding />
  
      <!-- Right Section: Reset Form -->
      <div class="reset-form">
        <div class="logo-small">
          <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
        </div>
  
        <form @submit.prevent="handleReset">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Enter your email" required />
  
          <div class="button-group">
            <!-- Cancel Button -->
            <button type="button" @click="handleCancel">Cancel</button>
            <!-- Submit / Reset Password Button -->
            <button type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { sendPasswordResetEmail } from 'firebase/auth';
  import { auth } from '@/firebase'; // <-- Adjust import path as needed
  import Branding from '@/components/Branding.vue'; // <-- Adjust import path as needed
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const router = useRouter();
  
  // Send password reset email via Firebase
  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email.value);
      console.log('Reset email sent');
      // ✅ Optionally, show a success message or redirect:
      router.push('/'); // e.g., go back to login
    } catch (error) {
      console.error('Error sending reset email:', error.message);
      // Optionally, show an error message to the user
    }
  };
  
  // Cancel button action (go back to login, or any other route)
  const handleCancel = () => {
    router.push('/');
  };
  </script>
  
  <style scoped>
  /* Container holds left branding and right form */
  .reset-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Right side: Reset Form */
  .reset-form {
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
    max-width: 350px;
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
  }
  
  /* Button Group (Cancel & Reset Password) */
  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  /* General button styling */
  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  /* Cancel button styling */
  button[type="button"] {
    background: #ccc;
    color: black;
  }
  
  button[type="button"]:hover {
    background: #aaa;
  }
  
  /* Reset button styling */
  button[type="submit"] {
    background: black;
    color: white;
  }
  
  button[type="submit"]:hover {
    background: #333;
  }
  </style>
  
<template>
    <div class="login-container">
      <!-- Left Section: Branding -->
      <div class="branding">
        <div class="logo">
          <img src="@/assets/hive-logo.png" alt="Hive Logo">
        </div>
      </div>
  
      <!-- Right Section: Login Form -->
      <div class="login-form">
        <div class="logo-small">
          <img src="@/assets/hive-small.png" alt="Hive Small Logo">
        </div>
        
        <form @submit.prevent="handleLogin">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Enter your email" required>
  
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" required>
  
          <button type="submit">Sign In</button>
        </form>
  
        <div class="links">
          <a href="#">Forgot password?</a>
          <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  
  const handleLogin = () => {
    console.log(`Logging in with Email: ${email.value}, Password: ${password.value}`);
  };
  </script>
  
  <style scoped>
  /* Main container (Fullscreen fix) */
  .login-container {
  display: flex;
  width: 100vw; /* Full width of the screen */
  height: 100vh; /* Full height */
  overflow: hidden;
}

/* ✅ FORCE `.branding` TO FILL LEFT SIDE PROPERLY */
.branding {
  flex-grow: 1; /* Allow it to expand */
  width: 50vw !important; /* FORCE 50% width */
  max-width: 50vw; /* Prevent it from shrinking */
  min-width: 50vw; /* Ensure it doesn't get smaller */
  background-image: url("@/assets/honeycomb-bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

/* ✅ ENSURE `.login-form` DOESN’T PUSH IT */
.login-form {
  flex-grow: 1;
  width: 50vw !important; /* Ensure it takes the other 50% */
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
  .logo img {
    width: 250px;
  }
  
  /* Right side: Login Form */

  .logo-small img {
    width: 60px;
    margin-bottom: 20px;
  }
  
  /* Form Styles */
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 350px;
  }
  
  label {
    font-weight: bold;
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
  
  button {
    margin-top: 20px;
    padding: 12px;
    background: black;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  button:hover {
    background: #333;
  }
  
  /* Links */
  .links {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 350px;
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
  
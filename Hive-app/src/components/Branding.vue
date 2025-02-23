<template>
    <div class="branding">
      <div class="logo">
        <img src="@/assets/hive-logo.png" alt="Hive Logo" />
      </div>
    </div>
  </template>
  
  <script setup>
  // No additional logic needed for now.
  </script>
  
  <style scoped>
  .branding {
    flex-grow: 1;
    width: 50vw !important;
    max-width: 50vw;
    min-width: 50vw;
    background-image: url("@/assets/honeycomb-bg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  .logo img {
    width: 250px;
  }
  </style>
  
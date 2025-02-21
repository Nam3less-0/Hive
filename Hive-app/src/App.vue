<template>
  <div id="app">
    <Login />
  </div>
</template>

<script setup>
import Login from "@/components/Login.vue";
</script>

<style>
/* ✅ ENSURE FULL WIDTH */
#app {
  width: 100vw !important;
  height: 100vh !important;
  display: flex;
  overflow: hidden;
  margin: 0;
  padding: 0;
  max-width: max-content;
}

/* ✅ PREVENT ANY CONTAINER FROM SHRINKING */
body, html {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
}
</style>

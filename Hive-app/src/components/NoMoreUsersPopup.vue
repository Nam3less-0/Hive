<template>
    <div class="popup-overlay">
      <div class="popup-content">
        <h2>No More Users Available</h2>
        <p>Please try again later.</p>
        <button @click="$emit('close')">OK</button>
      </div>
    </div>
  </template>
  
  <script setup>
    
  
  defineEmits(['close']);
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }
  
  .popup-content h2 {
    margin-bottom: 10px;
  }
  
  .popup-content button {
    padding: 10px 20px;
    border: none;
    background: #ffcc00;
    cursor: pointer;
    border-radius: 5px;
  }
  .popup-content button:hover {
    background: #ffaa00;
  }
  </style>
  
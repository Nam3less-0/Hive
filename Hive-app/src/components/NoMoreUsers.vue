<template>
    <div class="no-more-users">
      <img
        src="@/assets/sadBee.png"
        alt="Sad Bee"
        class="bee-icon"
      />
      <h2>No more users for now</h2>
      <p>Looks like you've buzzed through everyone! 🐝</p>
      <p>Check back later or widen your search.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "NoMoreUsers",
  };
  </script>
  
  <style scoped>
  .no-more-users {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    border-radius: 1rem;
    background-color: #fffbee;
    border: 2px dashed #ffcb00;
    color: #333;
    font-family: 'Arial', sans-serif;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  
  .bee-icon {
    width: 300px;
    height: 300px;
    margin-bottom: 1rem;
  }
  </style>
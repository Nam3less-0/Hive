<template>
    <div class="page-container">
      <!-- Left Section: Form -->
      <div class="description-form">
        <h3>Write a short description of yourself.</h3>
        <textarea
          v-model="description"
          placeholder="Description..."
        ></textarea>
        <button @click="finishSetup">Finish Setup Profile</button>
      </div>
  
      <!-- Right Section: Branding (Same style as previous pages) -->
      <Branding />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { doc, setDoc } from 'firebase/firestore';
  import { db, auth } from '@/firebase'; // adjust import as needed
  import Branding from '@/components/Branding.vue';
  
  const router = useRouter();
  const description = ref('');
  
  // Save description to Firestore, merging with the existing user document
  const finishSetup = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is logged in');
      router.push({ name: 'Login' });
      return;
    }
  
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { description: description.value },
        { merge: true } // don't overwrite existing fields
      );
      console.log('Profile description saved!');
  
      // Redirect to home (or wherever you want)
      router.push({ name: 'Home' });
    } catch (error) {
      console.error('Error saving profile description:', error);
    }
  };
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Left side: Description form */
  .description-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50vw;
    padding: 3rem;
    background: white;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }
  
  /* Heading */
  .description-form h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  /* Textarea for the description */
  .description-form textarea {
    flex: 1;
    resize: none;
    padding: 1rem;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f9f9f9;
  }
  
  /* Finish button */
  .description-form button {
    align-self: flex-start;
    padding: 12px;
    background: black;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .description-form button:hover {
    background: #333;
  }
  </style>
  
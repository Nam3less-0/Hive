<template>
  <div class="page-container">
    <!-- Left Section: Form -->
    <div class="description-form">
      <h3>Write a short description of yourself.</h3>
      <textarea
        v-model="description"
        placeholder="Short description..."
      ></textarea>

      <h3>Write your bio:</h3>
      <textarea
        v-model="bio"
        placeholder="Bio..."
      ></textarea>

      <button @click="finishSetup">Finish Setup Profile</button>
    </div>

    <!-- Right Section: Branding -->
    <Branding />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase'; // adjust your Firebase import as needed
import Branding from '@/components/Branding.vue';

const router = useRouter();

// Two fields: "description" and "bio"
const description = ref('');
const bio = ref('');

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
      {
        description: description.value,
        bio: bio.value,
      },
      { merge: true } // Don't overwrite other fields
    );
    console.log('Profile description & bio saved!');

    // Redirect to home (or any other page)
    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Error saving profile:', error);
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

/* Left side: Description + Bio form */
.description-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50vw;
  padding: 3rem;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.description-form h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

/* Textareas for description and bio */
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
  width: 100%;
  padding: 12px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-sizing: border-box;
}

.description-form button:hover {
  background: #333;
}
</style>

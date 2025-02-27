<template>
  <div class="page-container">
    <!-- Left Section: Description & Bio Form -->
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

      <button @click="saveProfile">Save and Continue</button>
    </div>

    <!-- Right Section: Branding -->
    <Branding />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Branding from '@/components/Branding.vue';

const router = useRouter();
const description = ref('');
const bio = ref('');

const saveProfile = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user is logged in');
    router.push({ name: 'Login' });
    return;
  }
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      { description: description.value, bio: bio.value },
      { merge: true }
    );
    console.log('Profile description & bio saved!');
    // Navigate to NewUserPage4 for image uploads
    router.push({ name: 'NewUserPage4' });
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

.description-form textarea {
  flex: 1;
  resize: none;
  padding: 1rem;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f9f9f9;
}

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

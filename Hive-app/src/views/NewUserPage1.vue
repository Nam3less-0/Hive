<template>
    <div class="user-container">
  
      <!-- Right Section: New User Form -->
      <div class="user-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>

      <form @submit.prevent="handleNext">
        <!-- Name Fields -->
        <label>Name</label>
        <div class="name-fields">
          <input
            v-model="firstName"
            type="text"
            placeholder="First Name"
            required
          />
          <input
            v-model="lastName"
            type="text"
            placeholder="Last Name"
            required
          />
        </div>

        <!-- Side-by-Side: Height and Gender -->
        <div class="side-by-side">
          <div class="field">
            <label>Height (cm)</label>
            <input
              v-model="height"
              type="number"
              step="0.1"
              placeholder="Height"
            />
          </div>
          <div class="field">
            <label>Gender</label>
            <select v-model="gender" required>
              <option disabled value="">Select Gender</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>

        <!-- Race -->
        <label>Race</label>
        <input
          v-model="race"
          type="text"
          placeholder="Race"
        />

        <!-- Religion -->
        <label>Religion</label>
        <input
          v-model="religion"
          type="text"
          placeholder="Religion"
        />

        <!-- Date of Birth -->
        <label>Date Of Birth</label>
        <input
          v-model="dateOfBirth"
          type="date"
          placeholder="Date of Birth"
        />

        <!-- Next Button -->
        <button type="submit">Next</button>
      </form>
    </div>

      <Branding/>
    </div>
  </template>
  
  <script setup>
  import Branding from '@/components/Branding.vue';
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { doc, setDoc } from 'firebase/firestore'
  import { db, auth } from '@/firebase' 
  
  // Form data
  const firstName = ref('')
  const lastName = ref('')
  const height = ref('')
  const gender = ref('')
  const race = ref('')
  const religion = ref('')
  const dateOfBirth = ref('')
  
  const router = useRouter()
  
  const handleNext = async () => {

    const user = auth.currentUser;
    if (!user) {
        console.error("No user is logged in");
        router.push({ name: "Login" });
        return;
    } 

    const uid = user.uid
    try {
      await setDoc(doc(db, 'users', uid), {
        firstName: firstName.value,
        lastName: lastName.value,
        height: height.value,
        gender: gender.value,
        race: race.value,
        religion: religion.value,
        dateOfBirth: dateOfBirth.value
      });
      console.log('User info saved!');
      router.push({ name: 'NewUserPage2' });
    } catch (error) {
      console.error('Error saving user info:', error.message);
    }
    
  
    // Then redirect to the next page (e.g., "Page 2" or "Home")
  }
  </script>
  
  <style scoped>
.user-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.user-form {
  width: 50vw !important;
  max-width: 50vw;
  min-width: 40vw;
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
  max-width: 25vw;
}

label {
  font-weight: bold;
  color: rgb(156, 156, 156);
  margin-top: 10px;
}

.name-fields {
  display: flex;
  gap: 10px;
  box-sizing: border-box;
}

.name-fields input {
  flex: 1;
}

.side-by-side {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  box-sizing: border-box;
}

.field {
  flex: 1;
  display: flex;
  gap: 10px;
  flex-direction: column;
  box-sizing: border-box;
}

input,
select {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  box-sizing: border-box;
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
  box-sizing: border-box;
}

button:hover {
  background: #333;
}
</style>
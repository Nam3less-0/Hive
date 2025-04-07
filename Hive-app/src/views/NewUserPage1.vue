<template>
  <div class="user-container">
    <!-- Right Section: New User Form -->
    <div class="user-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>

      <!-- Main form with gap between rows -->
      <form @submit.prevent="handleNext" class="form-content">
        
        <!-- Name Fields (1st row) -->
        <div class="form-row">
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
        </div>

        <!-- Height and Gender on the same row (2nd row) -->
        <div class="form-row side-by-side">
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

        <!-- Race Selector (3rd row) -->
        <div class="form-row">
          <label>Race</label>
          <select v-model="race" required>
            <option disabled value="">Select Race</option>
            <option value="Chinese">Chinese</option>
            <option value="Malay">Malay</option>
            <option value="Indian">Indian</option>
            <option value="Eurasian">Eurasian</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div class="form-row" v-if="race === 'others'">
          <label>Please specify your race</label>
          <input
            v-model="customRace"
            type="text"
            placeholder="Type your race"
          />
        </div>

        <!-- Religion Selector (4th row) -->
        <div class="form-row">
          <label>Religion</label>
          <select v-model="religion" required>
            <option disabled value="">Select Religion</option>
            <option value="Christian">Christian</option>
            <option value="Buddhist">Buddhist</option>
            <option value="Taoist">Taoist</option>
            <option value="Muslim">Muslim</option>
            <option value="Hindu">Hindu</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div class="form-row" v-if="religion === 'others'">
          <label>Please specify your religion</label>
          <input
            v-model="customReligion"
            type="text"
            placeholder="Type your religion"
          />
        </div>

        <!-- Date of Birth (5th row) -->
        <div class="form-row">
          <label>Date Of Birth</label>
          <input
            v-model="dateOfBirth"
            type="date"
            placeholder="Date of Birth"
          />
        </div>

        <!-- Next Button (6th row) -->
        <div class="form-row">
          <button type="submit">Next</button>
        </div>

      </form>
    </div>

    <Branding />
  </div>
</template>

<script setup>
import Branding from '@/components/Branding.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';

// Form data
const firstName = ref('');
const lastName = ref('');
const height = ref('');
const gender = ref('');
const race = ref('');
const customRace = ref('');
const religion = ref('');
const customReligion = ref('');
const dateOfBirth = ref('');

const router = useRouter();

const handleNext = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is logged in");
    router.push({ name: "Login" });
    return;
  }
  const uid = user.uid;
  try {
    await setDoc(doc(db, 'users', uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      height: height.value,
      gender: gender.value,
      race: race.value,
      customRace: race.value === 'others' ? customRace.value : '',
      religion: religion.value,
      customReligion: religion.value === 'others' ? customReligion.value : '',
      dateOfBirth: dateOfBirth.value
    }, { merge: true });
    console.log('User info saved!');
    router.push({ name: 'NewUserPage2' });
  } catch (error) {
    console.error('Error saving user info:', error.message);
  }
};
</script>

<style scoped>
.user-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Right side: Form container */
.user-form {
  width: 50vw;
  max-width: 50vw;
  min-width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  height: 90vh;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.logo-small img {
  width: 60px;
  margin-bottom: 20px;
}

/* Main form uses flex with gap for equal spacing between rows */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 25vw;
  box-sizing: border-box;
}

/* Each row is a vertical stack of label + input(s) */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* For side-by-side fields like height + gender */
.side-by-side {
  display: flex;
  gap: 10px;
}

.form-row.side-by-side {
  flex-direction: row; /* Ensures items in this row go left-to-right */
}


/* Each sub-field (label + input) in the side-by-side row */
.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Name fields in the same row */
.name-fields {
  display: flex;
  gap: 10px;
  box-sizing: border-box;
}

/* Input and select styling */
input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  box-sizing: border-box;
}

/* Label styling */
label {
  font-weight: bold;
  color: rgb(156, 156, 156);
}

/* Next button styling */
button {
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

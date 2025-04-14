<template>
  <div class="user-container">
    <div class="user-form">
      <div class="logo-small">
        <img src="@/assets/hive-small.png" alt="Hive Small Logo" />
      </div>

      <form @submit.prevent="handleNext($event)" class="form-content">
        <!-- Name Fields -->
        <div class="form-row side-by-side">
          <div class="field">
            <label>First Name</label>
            <input v-model="firstName" type="text" placeholder="First Name" @input="clearTooltip('firstName')" />
            <div v-if="showTooltip.firstName" class="tooltip-error">First name is required</div>
          </div>
          <div class="field">
            <label>Last Name</label>
            <input v-model="lastName" type="text" placeholder="Last Name" @input="clearTooltip('lastName')" />
            <div v-if="showTooltip.lastName" class="tooltip-error">Last name is required</div>
          </div>
        </div>

        <!-- Height and Gender -->
        <div class="form-row side-by-side">
          <div class="field">
            <label>Height (cm)</label>
            <input v-model="height" type="number" step="0.1" placeholder="Height" @input="clearTooltip('height')" />
            <p v-if="showTooltip.height" class="tooltip-error">Height is required</p>
          </div>
          <div class="field">
            <label>Gender</label>
            <select v-model="gender" @change="clearTooltip('gender')">
              <option disabled value="">Select Gender</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
            <p v-if="showTooltip.gender" class="tooltip-error">Gender is required</p>
          </div>
        </div>

        <!-- Race -->
        <div class="form-row">
          <label>Race</label>
          <select v-model="race" @change="clearTooltip('race')">
            <option disabled value="">Select Race</option>
            <option value="Chinese">Chinese</option>
            <option value="Malay">Malay</option>
            <option value="Indian">Indian</option>
            <option value="Eurasian">Eurasian</option>
            <option value="others">Others</option>
          </select>
          <p v-if="showTooltip.race" class="tooltip-error">Race is required</p>
        </div>

        <div class="form-row" v-if="race === 'others'">
          <label>Please specify your race</label>
          <input v-model="customRace" type="text" placeholder="Type your race" @input="clearTooltip('customRace')" />
          <p v-if="showTooltip.customRace" class="tooltip-error">Custom race is required</p>
        </div>

        <!-- Religion -->
        <div class="form-row">
          <label>Religion</label>
          <select v-model="religion" @change="clearTooltip('religion')">
            <option disabled value="">Select Religion</option>
            <option value="Christian">Christian</option>
            <option value="Buddhist">Buddhist</option>
            <option value="Taoist">Taoist</option>
            <option value="Muslim">Muslim</option>
            <option value="Hindu">Hindu</option>
            <option value="others">Others</option>
          </select>
          <p v-if="showTooltip.religion" class="tooltip-error">Religion is required</p>
        </div>

        <div class="form-row" v-if="religion === 'others'">
          <label>Please specify your religion</label>
          <input v-model="customReligion" type="text" placeholder="Type your religion" @input="clearTooltip('customReligion')" />
          <p v-if="showTooltip.customReligion" class="tooltip-error">Custom religion is required</p>
        </div>

        <!-- Date of Birth -->
        <div class="form-row">
          <label>Date Of Birth</label>
          <input v-model="dateOfBirth" type="date" @input="clearTooltip('dateOfBirth')" />
          <p v-if="showTooltip.dateOfBirth" class="tooltip-error">Date of birth is required</p>
        </div>

        <!-- Submit -->
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

const showTooltip = ref({
  firstName: false,
  lastName: false,
  height: false,
  gender: false,
  race: false,
  customRace: false,
  religion: false,
  customReligion: false,
  dateOfBirth: false,
});

function clearTooltip(field) {
  showTooltip.value[field] = false;
}

const handleNext = async (e) => {
  const t = showTooltip.value;
  t.firstName = !firstName.value;
  t.lastName = !lastName.value;
  t.height = !height.value;
  t.gender = !gender.value;
  t.race = !race.value;
  t.religion = !religion.value;
  t.dateOfBirth = !dateOfBirth.value;
  t.customRace = race.value === 'others' && !customRace.value;
  t.customReligion = religion.value === 'others' && !customReligion.value;

  const hasError = Object.values(t).some(Boolean);
  if (hasError) return;

  const dob = new Date(dateOfBirth.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  const isUnder18 = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

  if (dob > today) {
    alert("Please enter a valid date of birth.");
    return;
  }

  if (isUnder18) {
    alert("You must be at least 18 years old to make an account.");
    return;
  }

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
.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 25vw;
  box-sizing: border-box;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.side-by-side {
  display: flex;
  gap: 10px;
}
.form-row.side-by-side {
  flex-direction: row;
}
.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.name-fields {
  display: flex;
  gap: 10px;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  box-sizing: border-box;
  color: #7a7a7a;
}
label {
  font-weight: bold;
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
button {
  padding: 12px;
  background: #ffe96b;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-sizing: border-box;
}
button:hover {
  color: white;
}
.tooltip-error {
  color: red;
  margin-top: 6px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff0f0;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ffc0c0;
}
</style>


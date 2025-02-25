<template>
  <div class="connect-container">

    <!-- Left Section -->
    <div class="profile-card">
      <div class="profile-picture">
        <img src="@/assets/placeholder-profile.jpg" alt="User Profile Picture" />
      </div>
      <div class="profile-details">
        <h2>Peng Rong Neo </h2>
        <p><strong>Age:</strong> 23</p>
        <p><strong>Qualification:</strong> Bachelor of Science Business Analytics</p>
        <p><strong>Bio:</strong> Here to mingle and have fun!</p>
        <button class="message-btn" @click="showMessagePopup = true">Write a message 💬 </button>
      </div>
    </div>

    <!-- Right Section -->
    <div class="interaction-area">
      <div class="actions">
        <button class="pass-btn"> ✖️ Pass </button>
        <button class="like-btn"> ❤️ Like </button>
        <button class="filter-btn" @click="showFilter = true"> 🔎 Filter </button>
      </div>

      <div class="photos-section">
        <h3>Photos</h3>
        <div class="photos">
          <img v-for="n in 6" :key="n" src="@/assets/placeholder-profile.jpg" alt="User Photo" />
        </div>
      </div>

      <div class="interests-section">
        <h3>Interests</h3>
        <div class="interests">
          <span class="interest">Journeys</span>
          <span class="interest">Snowboarding</span>
          <span class="interest">Design</span>
          <span class="interest">Video games</span>
          <span class="interest">Cross stitch</span>
          <span class="interest">Foreign languages</span>
          <span class="interest">Dances</span>
          <span class="interest">Watching horror movies</span>
          <span class="interest">Detectives</span>
          <span class="interest">Game of Thrones</span>
          <span class="interest">Evening walks</span>
        </div>
      </div>

      <div class="description-section">
        <h3>Description</h3>
        <p class="descriptionText">
          Hey, I'm Neo Peng Rong! I'm a Business Analytics student who loves diving into data and solving complex problems...
        </p>
      </div>

      <div class="about-section">
        <h3>About Me</h3>
        <p><strong>Appearance:</strong> 188 cm, 75 kg, lean build, hole in teeth</p>
        <p><strong>Orientation:</strong> DAMN STRAIGHT</p>
        <p><strong>Relationships:</strong> About to Marry</p>
        <p><strong>Children:</strong> No but in 5 years time maybe have</p>
      </div>

    </div>

  </div>
 <!-- Filter Popup -->
 <div v-if="showFilter" class="filter-popup">
    <div class="filter-content">
      <h2>FILTER <button @click="showFilter = false" class="close-btn">✖️</button></h2>
      <ul>
        <li><strong>Interests</strong>
          <select v-model="selectedInterests" multiple>
            <option v-for="interest in interestOptions" :key="interest" :value="interest">{{ interest }}</option>
          </select>
        </li>
        <li><strong>Age Range</strong>
          <div class="age-slider">
            <input type="range" v-model="selectedAgeMin" min="18" max="50" @input="adjustAgeRange" />
            <input type="range" v-model="selectedAgeMax" min="18" max="50" @input="adjustAgeRange" />
          </div>
          <span>{{ selectedAgeMin }} - {{ selectedAgeMax }} years</span>
        </li>
        <li><strong>Height</strong>
          <input type="number" v-model="selectedHeight" min="140" max="210" /> cm
        </li>
        <li><strong>Race</strong>
          <select v-model="selectedRace">
            <option value="Chinese">Chinese</option>
            <option value="Malay">Malay</option>
            <option value="Indian">Indian</option>
            <option value="Others">Others</option>
          </select>
        </li>
        <li><strong>Religion</strong>
          <select v-model="selectedReligion">
            <option value="None">None</option>
            <option value="Christianity">Christianity</option>
            <option value="Islam">Islam</option>
            <option value="Hinduism">Hinduism</option>
            <option value="Buddhism">Buddhism</option>
          </select>
        </li>
        <li><strong>School</strong>
          <input type="text" v-model="selectedSchool" />
        </li>
        <li><strong>Industry</strong>
          <input type="text" v-model="selectedIndustry" />
        </li>
        <li><strong>Gender</strong>
          <select v-model="selectedGender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </li>
      </ul>
      <button @click="applyFilters">Apply Filters</button>
    </div>
  </div>

  <!-- Message Popup -->
  <div v-if="showMessagePopup" class="message-popup">
    <div class="message-content">
      <h2>Send a Message</h2>
      <img class="receiver-avatar" src="@/assets/placeholder-profile.jpg" alt="Receiver" />
      <textarea v-model="messageText" placeholder="Type your message..."></textarea>
      <div class="message-buttons">
        <button class="like-btn">❤️ Like & 📩 Send</button>
        <button class="cancel-btn" @click="showMessagePopup = false">❌ Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showFilter = ref(false);
const selectedInterests = ref([]);
const selectedAgeMin = ref(18);
const selectedAgeMax = ref(50);
const selectedHeight = ref(168);
const selectedRace = ref("Chinese");
const selectedReligion = ref("None");
const selectedSchool = ref("");
const selectedIndustry = ref("");
const selectedGender = ref("Female");

const interestOptions = ["Basketball", "Reading", "Gymming", "Music", "Travel", "Gaming", "Cooking", "Photography"];

const adjustAgeRange = () => {
  if (selectedAgeMin.value > selectedAgeMax.value) {
    [selectedAgeMin.value, selectedAgeMax.value] = [selectedAgeMax.value, selectedAgeMin.value];
  }
};

const applyFilters = () => {
  console.log("Filters Applied:", {
    selectedInterests: selectedInterests.value,
    selectedAgeMin: selectedAgeMin.value,
    selectedAgeMax: selectedAgeMax.value,
    selectedHeight: selectedHeight.value,
    selectedRace: selectedRace.value,
    selectedReligion: selectedReligion.value,
    selectedSchool: selectedSchool.value,
    selectedIndustry: selectedIndustry.value,
    selectedGender: selectedGender.value
  });
  showFilter.value = false;
};

const showMessagePopup = ref(false);
const messageText = ref("");
</script>

<style scoped>
/* Message Popup Styling */
.message-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 80%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  padding: 20px;
  text-align: center;
  border: 1px solid black;
}

.message-content h2 {
  margin-bottom: 10px;
}

.receiver-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid gray;
  resize: none;
}

.message-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.like-btn, .cancel-btn {
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.like-btn {
  background: lightyellow;
  border: 1px solid black;
}

.cancel-btn {
  background: lightcoral;
  border: 1px solid black;
}
.cancel-btn:hover {
  background: pink
}

/* Filter Popup Styling */
.filter-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url('@/assets/honeycomb-bg.png') no-repeat center center;
  background-size: cover;
  width: 80%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  padding: 20px;
  text-align: center;
  border: 1px solid black;
}

.age-slider {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.filter-content h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.filter-content ul {
  list-style: none;
  padding: 0;
}

.filter-content li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid black;
  cursor: pointer;
  align-items: center;
}

.connect-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.profile-card {
  background-color: lightyellow;
  border-radius: 15px;
  padding: 20px;
  width: 35%;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.profile-picture img {
  width: 80%;
  border-radius: 15px;
  object-fit: cover;
  margin-bottom: 5px;
}

.message-btn {
  background-color: #ffd400;
  border: 1px solid black;
  padding: 10px;
  border-radius: 20px;
  font-size: medium;
  cursor: pointer;
}

.message-btn:hover {
  background-color: darkorange;
}

.interaction-area {
  flex-grow: 1;
  text-align: left;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 20px;
  margin-bottom: 20px;
}

.pass-btn {
  padding: 10px 60px;
  border-radius: 10px;
  border: 1px solid black;
  font-size: large;
  cursor: pointer;
  background: #ccc;
}
.pass-btn:hover { 
  background: darkgrey;
}
.like-btn {
  padding: 10px 60px;
  border-radius: 10px;
  border: 1px solid black;
  font-size: large;
  cursor: pointer;
  background:  lightyellow;
}

.like-btn:hover {
  background: #FFD400;
}

.filter-btn {
  float:inline-end;
  background: none;
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: small;
  cursor: pointer;
  float: right;
}
.filter-btn:hover {
  background: #FFD400;

}

.photos {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 20px;
}

.photos img {
  height: 80px;
  width: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.interest {
  background-color: #e8f0fe;
  padding: 5px 10px;
  border-radius: 15px;
  margin: 5px;
  display: inline-block;
  font-size: 0.85rem;
}

.descriptionText {
  border: 1px solid lightgray;
  padding: 10px;
  border-radius: 5px;
}

</style>

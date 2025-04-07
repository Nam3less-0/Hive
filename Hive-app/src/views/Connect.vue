<template>
  <div class="connect-container">
    <!-- Display One User at a Time -->
    <div v-if="users.length > 0 && currentUserIndex < users.length" class="profile-card" :class="animationDirection"
  @animationend="handleAnimationEnd">
  <!-- Heart & Cross Animations -->
<div class="overlay-icon heart" v-if="showHeart">❤️</div>
<div class="overlay-icon cross" v-if="showCross">❌</div>
      <div class="profile-picture">
        <img :src="users[currentUserIndex].images && users[currentUserIndex].images.length > 0 
          ? users[currentUserIndex].images[0] 
          : placeholderProfile" 
          alt="User Profile Picture" />
      </div>
      <div class="profile-details">
        <h2>{{ users[currentUserIndex].firstName }} {{ users[currentUserIndex].lastName }}</h2>
        <p><strong>Height:</strong> {{ users[currentUserIndex]?.height || 'N/A' }}</p>
        <p><strong>Age:</strong> {{ calculateAge(users[currentUserIndex]?.dateOfBirth) }}</p>
        <p><strong>Bio:</strong> {{ users[currentUserIndex]?.bio || 'No bio available' }}</p>
        <button class="message-btn" @click="showMessagePopup = true">Write a message here 💬</button>
        <p class="user-progress">Viewing user {{ currentUserIndex + 1 }} of {{ users.length }}</p>
      </div>
    </div>

    <!-- No More Users --> 
    <NoMoreUsers v-else />

    <!-- Right Section -->
    <div v-if="users.length > 0 && currentUserIndex < users.length" class="interaction-area">
      <div class="actions">
        <button class="pass-btn" @click="passUser">✖️ Pass</button>
        <button class="like-btn" @click="likeUser">❤️ Like</button>
        <button class="filter-btn" @click="showFilter = true"> 🔎 Filter </button>
      </div>

      <div class="photos-section">
        <h3>Photos</h3>
        <div class="photos">
          <img v-for="(photo, index) in users[currentUserIndex]?.images ?? []"
                :key="index"
                :src="photo"
                alt="User Photo" />
        </div>
      </div>

      <div class="interests-section">
        <h3>Interests</h3>
        <div class="interests">
          <span class="interest" v-for="(interest, index) in users[currentUserIndex]?.interests || []" :key="index">
            {{ interest }}
          </span>
        </div>
      </div>

      <div class="description-section">
        <h3>Description</h3>
        <p class="descriptionText">
          {{ users[currentUserIndex]?.description || 'No description available' }}
        </p>

      </div>

      <div class="about-section">
        <h3>About Me</h3>
        <p><strong>Race:</strong> {{ users[currentUserIndex]?.race || 'N/A' }}</p>
        <p><strong>Religion:</strong> {{ users[currentUserIndex]?.religion || 'N/A' }}</p>
        <p><strong>School:</strong> {{ users[currentUserIndex]?.school || 'N/A' }}</p>
        <p><strong>Industry:</strong> {{ users[currentUserIndex]?.industry || 'N/A' }}</p>
      </div>

    </div>

  </div>

<!-- Filter Popup -->
<div v-if="showFilter" class="filter-popup">
  <div class="filter-content">
    <h2>
      Find the Right Buzz ~ 🐝
      <button @click="showFilter = false" class="close-btn">✖️</button>
    </h2>

    <!-- Interests -->
    <li>
      <strong>Interests</strong>
      <div class="interests-container">
        <div v-for="interest in interestOptions" :key="interest" class="interest-option">
          <label>
            <input type="checkbox" :value="interest" v-model="selectedInterests" />
            {{ interest }}
          </label>
        </div>
      </div>
    </li>

    <!-- Age Range -->
    <li>
      <strong>Age Range</strong>
      <div class="age-slider">
        <input type="range" v-model="selectedAgeMin" min="18" max="50" @input="adjustAgeRange" />
        <input type="range" v-model="selectedAgeMax" min="18" max="50" @input="adjustAgeRange" />
      </div>
      <span>{{ selectedAgeMin }} - {{ selectedAgeMax }} years</span>
    </li>

    <!-- Height -->
    <li>
      <strong>Height</strong>
      <div class="height-slider">
        <input type="range" v-model="selectedHeightMin" min="140" max="210" />
        <input type="range" v-model="selectedHeightMax" min="140" max="210" />
      </div>
      <span>{{ selectedHeightMin }} - {{ selectedHeightMax }} cm</span>
    </li>

    <!-- Race -->
    <li>
      <strong>Race</strong>
      <select v-model="selectedRace">
        <option value="">No preference</option>
        <option value="Chinese">Chinese</option>
        <option value="Malay">Malay</option>
        <option value="Indian">Indian</option>
        <option value="Eurasian">Eurasian</option>
        <option value="Others">Others</option>
      </select>
    </li>

    <!-- Religion -->
    <li>
      <strong>Religion</strong>
      <select v-model="selectedReligion">
        <option value="">No preference</option>
        <option value="Christian">Christian</option>
        <option value="Muslim">Muslim</option>
        <option value="Hindu">Hindu</option>
        <option value="Buddhist">Buddhist</option>
        <option value="Taoist">Taoist</option>
        <option value="others">Others</option>
      </select>
    </li>

    <!-- School -->
    <li>
      <strong>School</strong>
      <select v-model="selectedSchool">
        <option value="">No preference</option>
        <option v-for="option in schoolOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </li>

    <!-- Industry -->
    <li>
      <strong>Industry</strong>
      <select v-model="selectedIndustry">
        <option value="">No preference</option>
        <option v-for="option in industryOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </li>


    <!-- Gender -->
    <li>
      <strong>Gender</strong>
      <select v-model="selectedGender">
        <option value="">No preference</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>
    </li>

    <!-- Buttons -->
    <div class="filter-buttons">
      <button class="apply-btn" @click="applyFilters">Apply Filters</button>
      <button class="reset-btn" @click="resetFilters">Reset Filters</button>
    </div>
  </div>
</div>


  <!-- Message Popup -->
  <div v-if="showMessagePopup" class="message-popup">
    <div class="message-content">
      <h2>Send a Message</h2>
      <img class="receiver-avatar" 
           :src="users[currentUserIndex]?.images?.[0] || placeholderProfile" 
           alt="Receiver" />
      <textarea v-model="messageText" placeholder="Type your message..."></textarea>
      <div class="message-buttons">
        <button class="like-btn" @click="likeAndSendMessage">❤️ Like & 📩 Send</button>
        <button class="cancel-btn" @click="showMessagePopup = false">❌ Cancel</button>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db, auth } from '@/firebase';
import { collection, getDocs, increment, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import placeholderProfile from '@/assets/placeholder-profile.jpg';
import NoMoreUsersPopup from '@/components/NoMoreUsersPopup.vue';


import NoMoreUsers from "@/components/NoMoreUsers.vue";

import { fetchGlobalInterests, encodeInterests, cosineSimilarity } from '@/utils/matchmaker';

//Logic for filter button
const originalUsers = ref([]); // all users before filtering
const showFilter = ref(false);
const selectedInterests = ref([]);
const selectedAgeMin = ref(18);
const selectedAgeMax = ref(50);
const selectedHeightMin = ref(150);
const selectedHeightMax = ref(190);
const selectedRace = ref("");
const selectedReligion = ref("");
const selectedSchool = ref("");
const selectedIndustry = ref("");
const selectedGender = ref("");

// Label Display
const selectedSchoolLabel = ref("Select School");
const selectedIndustryLabel = ref("Select Industry");

// Dropdown State
const dropdownOpen = ref({
  school: false,
  industry: false
});

const showHeart = ref(false);
const showCross = ref(false);


// Options
const interestOptions = ref([]);
const schoolOptions = ref([
  { value: "NUS", label: "National University of Singapore (NUS)" },
  { value: "NTU", label: "Nanyang Technological University (NTU)" },
  { value: "SMU", label: "Singapore Management University (SMU)" },
  { value: "SUTD", label: "Singapore University of Technology and Design (SUTD)" },
  { value: "SUSS", label: "Singapore University of Social Sciences (SUSS)" }
]);

const industryOptions = ref([
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Engineering", label: "Engineering" },
  { value: "Retail", label: "Retail" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Government", label: "Government" }
]);

// Users and Pagination
const users = ref([]);
const currentUserIndex = ref(0);
const currentUser = ref(null);
const noMoreUsers = ref(false);
const animationDirection = ref(null);

// Dropdown Handlers
const toggleDropdown = (type) => {
  dropdownOpen.value[type] = !dropdownOpen.value[type];
  console.log('Toggled', type, dropdownOpen.value[type]);
};

const selectOption = (type, option) => {
  if (type === 'school') {
    selectedSchool.value = option.value;
    selectedSchoolLabel.value = option.label;
  } else if (type === 'industry') {
    selectedIndustry.value = option.value;
    selectedIndustryLabel.value = option.label;
  }
  dropdownOpen.value[type] = false;
};

// Validation
const adjustAgeRange = () => {
  if (selectedAgeMin.value > selectedAgeMax.value) {
    [selectedAgeMin.value, selectedAgeMax.value] = [selectedAgeMax.value, selectedAgeMin.value];
  }
};
// Reset filters to default
const resetFilters = () => {
  selectedInterests.value = [];
  selectedAgeMin.value = 18;
  selectedAgeMax.value = 50;
  selectedHeightMin.value = 140;
  selectedHeightMax.value = 210;
  selectedRace.value = "";
  selectedReligion.value = "";
  selectedSchool.value = "";
  selectedIndustry.value = "";
  selectedGender.value = "";

  selectedSchoolLabel.value = "Select School";
  selectedIndustryLabel.value = "Select Industry";
};

// Apply Filters
const applyFilters = () => {
  adjustAgeRange();

  users.value = originalUsers.value.filter(user => {
    const age = calculateAge(user.dateOfBirth);
    const height = parseInt(user.height);

    return (
      (!selectedInterests.value.length || selectedInterests.value.some(interest => user.interests?.includes(interest))) &&
      (!isNaN(age) && age >= selectedAgeMin.value && age <= selectedAgeMax.value) &&
      (!isNaN(height) && height >= selectedHeightMin.value && height <= selectedHeightMax.value) &&
      (!selectedRace.value || user.race === selectedRace.value) &&
      (!selectedReligion.value || user.religion === selectedReligion.value) &&
      (!selectedSchool.value || user.school === selectedSchool.value) &&
      (!selectedIndustry.value || user.industry === selectedIndustry.value) &&
      (!selectedGender.value || user.gender === selectedGender.value)
    );
  });

  currentUserIndex.value = 0;
  showFilter.value = false;
};



onMounted(async () => {
  try {
    const interestsSnapshot = await getDocs(collection(db, "interests"));
    const fetched = [];
    interestsSnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        fetched.push(docSnap.data().name); // <-- assuming each doc has { name: "Photography" } etc.
      }
    });
    interestOptions.value = fetched;
    console.log("Fetched interests:", fetched);

    auth.onAuthStateChanged(async (loggedInUser) => {
      if (!loggedInUser) {
        console.error("No authenticated user found.");
        return;
      }

      console.log("Logged-in UID:", loggedInUser.uid);
      currentUser.value = loggedInUser;

      // Get the logged-in user's Firestore document
      const userDocRef = doc(db, "users", loggedInUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error("Logged-in user document not found in Firestore.");
        return;
      }

      const loggedInUserData = userDocSnap.data();
      const seenArray = loggedInUserData.seen || []; // Ensure seen array exists

      // Fetch Global Interests and get Users Interest Vector
      const globalInterests = await fetchGlobalInterests();
      const loggedInUserVector = encodeInterests(loggedInUserData.interests || [], globalInterests);

      console.log("Seen Users:", seenArray);

      // Fetch all users from Firestore
      const userCollection = collection(db, "users");
      const querySnapshot = await getDocs(userCollection);
      console.log("All users fetched from Firestore:", querySnapshot.docs.map(doc => doc.data()));
      originalUsers.value = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== loggedInUser.uid && !seenArray.includes(user.id));

      // Filter out the logged-in user AND users in the seen array
      const otherUsers = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== loggedInUser.uid && !seenArray.includes(user.id));

      // Sort users in order of similarity
      const sortedUsers = otherUsers.map(user => {
        const vector = encodeInterests(user.interests || [], globalInterests);
        const similarity = cosineSimilarity(loggedInUserVector, vector);
        return { ...user, similarity };
      }).sort((a, b) => b.similarity - a.similarity);

      users.value = sortedUsers;

      console.log("Filtered users (not in seen array):", users.value);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  const schoolsSnapshot = await getDocs(collection(db, 'schools'));
  schoolOptions.value = schoolsSnapshot.docs.map(doc => ({
    value: doc.id,
    label: doc.data().name
  }));

  const industriesSnapshot = await getDocs(collection(db, 'industries'));
  industryOptions.value = industriesSnapshot.docs.map(doc => ({
    value: doc.id,
    label: doc.data().name
  }));

});

//Logic for Message Button
const showMessagePopup = ref(false);
const messageText = ref("");

// Function to move to the next user
const preloadNextUserImage = () => {
  const nextUser = users.value[currentUserIndex.value + 1];
  if (nextUser && nextUser.images && nextUser.images[0]) {
    const img = new Image();
    img.src = nextUser.images[0];
  }
};
const nextUser = () => {
  // Remove the current user from the list
  users.value.splice(currentUserIndex.value, 1);
  preloadNextUserImage();
  if (users.value.length === 0) {
    noMoreUsers.value = true;
    return;
    
  }

  // Reset index if out of bounds
  if (currentUserIndex.value >= users.value.length) {
    currentUserIndex.value = 0;
  }
};

// Function to update the "seen" array in Firestore
const updateSeenArray = async (userId, seenUserId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      seen: arrayUnion(seenUserId),
    });
   
  } catch (error) {
    console.error("Error updating seen array:", error);
  }
};

// Function to handle "Pass" button click
const passUser = async () => {
  if (!currentUser.value || users.value.length === 0) return;

  const myUserId = currentUser.value.uid;
  const passedUserId = users.value[currentUserIndex.value].id;

  await updateSeenArray(myUserId, passedUserId);
  animationDirection.value = 'slide-left';
  showCross.value = true;
};

// Function to handle "Like" button click
const likeUser = async () => {
  if (!currentUser.value || users.value.length === 0) return;

  const myUserId = currentUser.value.uid;
  const likedUserId = users.value[currentUserIndex.value].id;

  try {
    // Update the logged-in user's seen array
    await updateSeenArray(myUserId, likedUserId);
    showHeart.value = true;

    // Update the liked user's "likes" array
    await updateDoc(doc(db, "users", likedUserId), {
      likes: arrayUnion({ userId: myUserId, message: null }),
      likeCount: increment(1)
    });
    animationDirection.value = 'slide-right';

 
  } catch (error) {
    console.error("Error liking user:", error);
  }

  
};

// Function to handle "Like & Send Message" button click
const likeAndSendMessage = async () => {
  if (!messageText.value.trim()) {
    alert("Message cannot be empty!");
    return;
  }

  if (!currentUser.value || users.value.length === 0) return;

  const myUserId = currentUser.value.uid;
  const likedUserId = users.value[currentUserIndex.value].id;

  try {
    // Update the logged-in user's seen array
    await updateSeenArray(myUserId, likedUserId);

    // Update the liked user's "likes" array with the message
    await updateDoc(doc(db, "users", likedUserId), {
      likes: arrayUnion({ userId: myUserId, message: messageText.value }),
    });


  } catch (error) {
    console.error("Error liking user with message:", error);
  }

  showMessagePopup.value = false;
  messageText.value = "";
  nextUser();
};

//Logic for age calculation
const calculateAge = (dob) => {
  if (!dob) return 'Unknown';
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};





const handleAnimationEnd = () => {
  // Clear animation class
  animationDirection.value = null;
  showHeart.value = false;
  showCross.value = false;
  // move to next user after animation
  nextUser();
};
</script>

<style scoped>



.overlay-icon {
  position: absolute;
  top: 10%;
  left: 50%;
  font-size: 5rem;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0;
  animation: fadePop 0.5s ease-in-out forwards;
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) scale(1);
  }
}

.heart {
  color: red;
}

.cross {
  color: #333;
}

/* Slide animations */
@keyframes slideRight {
  0% {
    transform: translateX(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(200%) rotate(15deg) scale(0.9);
    opacity: 0;
  }
}

@keyframes slideLeft {
  0% {
    transform: translateX(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-200%) rotate(-15deg) scale(0.9);
    opacity: 0;
  }
}

.slide-right {
  animation: slideRight 1.5s ease-out forwards;
}

.slide-left {
  animation: slideLeft 1.5s ease-out forwards;
}




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
/* End of Message Popup Styling */

/* Filter Popup Styling */
.filter-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 85%;
  max-width: 400px;
  padding: 20px;
  background: url('@/assets/honeycomb-bg.png') no-repeat center center;
  background-size: cover;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border: 1px solid black;
  overflow: visible;
  z-index: 9999;
}

.filter-content {
  position: relative;
  z-index: 10; /* Important for dropdowns inside */
  text-align: center;
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
  margin: 0;
}

.filter-content li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid black;
  gap: 10px;
  position: relative;
}

/* Interests Styling */
.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 100px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: beige;
  flex: 1;
}

.interest-option {
  font-size: 0.75rem;
  white-space: nowrap;
}

.custom-interest {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  width: 100%;
}

.custom-interest input {
  flex: 1;
  font-size: 0.75rem;
}

select {
  width: 100%;
  padding: 6px 10px;
  font-size: 0.95rem;
  border: 1px solid #e0b300; /* honey border */
  border-radius: 6px;
  background-color: #fffbe6; /* soft honey background */
  color: #333;
  font-family: inherit;
  box-sizing: border-box;
  appearance: none;

  /* optional honey drop arrow */
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23e0b300' height='20' width='20' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

/* Add spacing between selects if needed */
li select {
  margin-top: 4px;
}
/* Sliders */
.age-slider,
.height-slider {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex: 1;
}

input[type="range"] {
  flex: 1;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.apply-btn,
.reset-btn {
  padding: 10px 20px;
  font-size: 0.95rem;
  background: white;
  color: black;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-btn:hover,
.reset-btn:hover {
  background: #ffec99; /* soft honey hover */
  border-color: #e0b300;
}

/* End of Filter Popup Styling */


/* Left Profile Card Styling */
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
  width: 20vw;
  height: 20vw;
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
/* End of Left Profile Card Styling */

/* Right side items styling */
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
/*End of Right side items styling*/


.no-more-users {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fffbee;
  text-align: center;
  padding: 2rem;
  box-sizing: border-box;
}

.bee-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

</style>
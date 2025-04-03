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
import { ref } from 'vue';
import { onMounted } from 'vue';
import { db, auth } from '@/firebase';
import { collection, getDocs, increment, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import placeholderProfile from '@/assets/placeholder-profile.jpg';
import NoMoreUsersPopup from '@/components/NoMoreUsersPopup.vue';

import NoMoreUsers from "@/components/NoMoreUsers.vue";

import { fetchGlobalInterests, encodeInterests, cosineSimilarity } from '@/utils/matchmaker';

//Logic for filter button
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
const showHeart = ref(false);
const showCross = ref(false);

const users = ref([]);
const interestOptions = ["Basketball", "Reading", "Gymming", "Music", "Travel", "Gaming", "Cooking", "Photography"];
const currentUserIndex = ref(0);
const currentUser = ref(null);
const noMoreUsers = ref(false);
const animationDirection = ref(null);

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

onMounted(async () => {
  try {
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
<template>
  <!--Dynamic Background-->
  <div class="background-grid-wrapper">
      <div class="background-grid">
        <div
          v-for="n in 400"
          :key="n"
          class="grid-cell"
          :style="getRandomAnimationStyle()"
        ></div>
      </div>
    </div>
  <div class="connect-layout">
    <!-- Filter Button at Top Right -->
    <button class="filter-btn-top" @click="showFilter = true">🔎 Filter</button>

    <!-- Three Column Layout -->
    <div class="columns">
      <!-- Left Column: Pass Button -->
      <div class="left-column">
        <button class="pass-btn" @click="passUser">✖️ Pass</button>
      </div>

      <!-- Center Column -->
      <div class="center-column">
        <!-- Profile Card -->
        <div v-if="users.length > 0 && currentUserIndex < users.length" class="profile-card" 
             :class="animationDirection" @animationend="handleAnimationEnd">
          <!-- Heart & Cross Animations -->
          <div class="overlay-icon heart" v-if="showHeart">❤️</div>
          <div class="overlay-icon cross" v-if="showCross">❌</div>
          
          <!-- Conditionally Render Main or Detail Card -->
          <div v-if="!showDetails" class="profile-main" @click="toggleDetails">
            <div class="profile-picture-container">
              <img class="profile-image" :src="users[currentUserIndex].images && users[currentUserIndex].images.length > 0 
                ? users[currentUserIndex].images[0] 
                : placeholderProfile" 
                alt="User Profile Picture" />
    
              <!-- Status Icons like in the image -->
              <div class="profile-status-icons">
                <div class="status-icon favorite-icon">⭐</div>
              </div>
    
              <!-- User Name Overlay on Image -->
              <div class="profile-name-overlay">
                <h2>{{ users[currentUserIndex].firstName }} {{ users[currentUserIndex].lastName }}, {{ calculateAge(users[currentUserIndex]?.dateOfBirth) }}</h2>
              </div>
            </div>
  
            <!-- Profile Details Below Image -->
            <div class="profile-details">
            <p><strong>{{ users[currentUserIndex]?.industry || 'Professional' }}</strong></p>
    
              <!-- Tags like in the image -->
            <div class="user-tags">
              <span class="user-tag" v-if="users[currentUserIndex]?.height">{{ users[currentUserIndex].height }} cm</span>
              <span class="user-tag" v-if="users[currentUserIndex]?.school">{{ users[currentUserIndex].school }}</span>
            </div>
    
            <p>{{ users[currentUserIndex]?.bio || 'No bio available' }}</p>
    
            <button class="message-btn" @click.stop="showMessagePopup = true">Write a message here 💬</button>
            <p class="user-progress">Viewing user {{ currentUserIndex + 1 }} of {{ users.length }}</p>
            </div>
          </div>
          
          <div v-else class="detail-card">
            <div class="detail-header">
              <h2>{{ users[currentUserIndex].firstName }} {{ users[currentUserIndex].lastName }}</h2>
              <button class="close-btn" @click="toggleDetails">
                <span>Close</span> <span>✕</span>
              </button>
            </div>
  
            <div class="detail-content">
              <!-- Photos Section -->
              <div>
                <div class="section-header">
                  <div class="section-icon">📸</div>
                  <h3>Photos</h3>
                </div>
                <div class="photos-gallery">
                  <div class="photo-item" v-for="(photo, index) in users[currentUserIndex]?.images ?? []" :key="index">
                    <img :src="photo" alt="User Photo" />
                  </div>
                </div>
              </div>
          
              <!-- Interests Section -->
              <div>
                <div class="section-header">
                  <div class="section-icon">⭐</div>
                  <h3>Interests</h3>
                </div>
                <div class="interests-list">
                  <span class="interest-tag" v-for="(interest, index) in users[currentUserIndex]?.interests || []" :key="index">
                    {{ interest }}
                  </span>
                  <span v-if="(users[currentUserIndex]?.interests || []).length === 0" class="interest-tag">
                    No interests listed
                  </span>
                </div>
              </div>

              <!-- Description Section -->
              <div>
                <div class="section-header">
                  <div class="section-icon">💬</div>
                  <h3>About Me</h3>
                </div>
                <div class="description-card">
                  <p class="description-text">
                    {{ users[currentUserIndex]?.description || 'No description available' }}
                  </p>
                </div>
              </div>

              <!-- Personal Info Section -->
              <div>
                <div class="section-header">
                  <div class="section-icon">👤</div>
                  <h3>Personal Details</h3>
                </div>
                <div class="about-grid">
                  <div class="about-item">
                    <div class="about-label">Age</div>
                    <div class="about-value">{{ calculateAge(users[currentUserIndex]?.dateOfBirth) }} years</div>
                  </div>
                  <div class="about-item">
                    <div class="about-label">Height</div>
                    <div class="about-value">{{ users[currentUserIndex]?.height || 'N/A' }} cm</div>
                  </div>
                  <div class="about-item">
                    <div class="about-label">Race</div>
                    <div class="about-value">{{ users[currentUserIndex]?.race || 'Not specified' }}</div>
                  </div>
                  <div class="about-item">
                    <div class="about-label">Religion</div>
                    <div class="about-value">{{ users[currentUserIndex]?.religion || 'Not specified' }}</div>
                  </div>
                  <div class="about-item">
                    <div class="about-label">School</div>
                    <div class="about-value">{{ users[currentUserIndex]?.school || 'Not specified' }}</div>
                  </div>
                  <div class="about-item">
                    <div class="about-label">Industry</div>
                    <div class="about-value">{{ users[currentUserIndex]?.industry || 'Not specified' }}</div>
                  </div>
                </div>
              </div>
    
              <!-- Action Buttons -->
              <div class="action-buttons">
                <button class="action-btn message-action" @click.stop="showMessagePopup = true">
                  <span>💬</span> Message
                </button>
                <button class="action-btn like-action" @click="likeUser">
                  <span>❤️</span> Like
                </button>
              </div>
            </div>
          </div>
          
        </div>

        <!-- No More Users -->
        <NoMoreUsers v-else />
      </div>

      <!-- Right Column: Like Button -->
      <div class="right-column">
        <button class="like-btn" @click="likeUser">❤️ Like</button>
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

        <!-- Other filters (Race, Religion, School, Industry, Gender) -->
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

        <li>
          <strong>School</strong>
          <select v-model="selectedSchool">
            <option value="">No preference</option>
            <option v-for="option in schoolOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </li>

        <li>
          <strong>Industry</strong>
          <select v-model="selectedIndustry">
            <option value="">No preference</option>
            <option v-for="option in industryOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </li>

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
        <div class="message-header">
          <h2>Send a Message</h2>
          <button class="close-btn" @click="showMessagePopup = false">
            <span>&times;</span>
          </button>
        </div>
    
        <div class="receiver-info">
          <img class="receiver-avatar" 
            :src="users[currentUserIndex]?.images?.[0] || placeholderProfile" 
            alt="Receiver" />
          <span class="receiver-name">{{ users[currentUserIndex]?.name || 'User' }}</span>
        </div>
    
        <textarea 
          v-model="messageText" 
          placeholder="Type your message here..." 
          rows="4"
          class="custom-textarea"
          @focus="isTextareaFocused = true"
          @blur="isTextareaFocused = false"
        ></textarea>
    
        <div class="message-buttons">
          <button class="cancel-btn" @click="showMessagePopup = false">Cancel</button>
          <button class="send-btn" @click="likeAndSendMessage">
            <span class="btn-icon">❤️</span> Like & Send <span class="btn-icon">📩</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db, auth } from '@/firebase';
import { collection, getDocs, increment, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import placeholderProfile from '@/assets/placeholder-profile.jpg';
import NoMoreUsers from "@/components/NoMoreUsers.vue";

import { fetchGlobalInterests, encodeInterests, cosineSimilarity } from '@/utils/matchmaker';

// Profile detail toggle
const showDetails = ref(false);
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

// Users and Pagination
const users = ref([]);
const originalUsers = ref([]);
const currentUserIndex = ref(0);
const currentUser = ref(null);
const noMoreUsers = ref(false);
const animationDirection = ref(null);

// Animation effects
const showHeart = ref(false);
const showCross = ref(false);

// Filter variables
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

const getRandomAnimationStyle = () => {
    const delay = (Math.random() * 5).toFixed(2);      // 0 to 5s
    const duration = (2 + Math.random() * 3).toFixed(2); // 2 to 5s
    return {
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    };
  }

// Options for dropdowns
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

// Messaging system
const showMessagePopup = ref(false);
const messageText = ref("");

// Age calculation function
const calculateAge = (dob) => {
  if (!dob) return 'Unknown';
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

// Load data on mount
onMounted(async () => {
  try {
    // Fetch interests
    const interestsSnapshot = await getDocs(collection(db, "interests"));
    const fetched = [];
    interestsSnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        fetched.push(docSnap.data().name);
      }
    });
    interestOptions.value = fetched;
    
    // Handle authentication
    auth.onAuthStateChanged(async (loggedInUser) => {
      if (!loggedInUser) {
        console.error("No authenticated user found.");
        return;
      }

      currentUser.value = loggedInUser;

      // Get user document
      const userDocRef = doc(db, "users", loggedInUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error("Logged-in user document not found in Firestore.");
        return;
      }

      const loggedInUserData = userDocSnap.data();
      const seenArray = loggedInUserData.seen || [];

      // Fetch interests and user vector
      const globalInterests = await fetchGlobalInterests();
      const loggedInUserVector = encodeInterests(loggedInUserData.interests || [], globalInterests);

      // Fetch all users
      const userCollection = collection(db, "users");
      const querySnapshot = await getDocs(userCollection);
      
      originalUsers.value = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== loggedInUser.uid && !seenArray.includes(user.id));

      // Filter out the logged-in user and seen users
      const otherUsers = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== loggedInUser.uid && !seenArray.includes(user.id));

      // Sort users by similarity
      const sortedUsers = otherUsers.map(user => {
        const vector = encodeInterests(user.interests || [], globalInterests);
        const similarity = cosineSimilarity(loggedInUserVector, vector);
        return { ...user, similarity };
      }).sort((a, b) => b.similarity - a.similarity);

      users.value = sortedUsers;
    });

    // Fetch schools and industries
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
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Filter functions
const adjustAgeRange = () => {
  if (selectedAgeMin.value > selectedAgeMax.value) {
    [selectedAgeMin.value, selectedAgeMax.value] = [selectedAgeMax.value, selectedAgeMin.value];
  }
};

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
};

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

// User interaction functions
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

// Update seen array in Firestore
const updateSeenArray = async (userId, seenUserId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      seen: arrayUnion(seenUserId),
    });
  } catch (error) {
    console.error("Error updating seen array:", error);
  }
};

// Handle pass user
const passUser = async () => {
  if (!currentUser.value || users.value.length === 0) return;

  const myUserId = currentUser.value.uid;
  const passedUserId = users.value[currentUserIndex.value].id;

  await updateSeenArray(myUserId, passedUserId);
  animationDirection.value = 'slide-left';
  showCross.value = true;
};

// Handle like user
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

// Handle like and send message
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

// Handle animation end
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
/* Background */
.background-grid-wrapper {
  position: fixed;
  top: 8vh;
  left: 0;
  width: 100vw;
  height: calc(100vh - 8vh);
  z-index: 0;
  overflow: hidden;
  backdrop-filter: blur(10px); /* 🔥 the actual blur */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  pointer-events: none;
}

.background-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: 100px;
  width: 100%;
  height: 100%;
}

.grid-cell {
  background-color: #ffd400;
  border: 1px solid #fbc02d;
  animation-name: sparkle;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  filter: blur(6px);
}

@keyframes sparkle {
  0%, 100% {
    background-color: #ffd400;
  }
  50% {
    background-color: rgb(255, 252, 103);
  }
}

/* Main Layout */
.connect-layout {
  position: relative;
  height: 85vh; /* Account for header height */
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.columns {
  display: flex;
  width: 100%;
  height: 100%;
  flex: 1;
}

.left-column,
.right-column {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
}

.center-column {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1rem;
}

/* Filter Button */
.filter-btn-top {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: white;
  border: 1px solid black;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: clamp(0.75rem, 2vw, 1rem);
  cursor: pointer;
}

.filter-btn-top:hover {
  background: #FFD400;
}

/* Profile Card Styling */
.profile-picture-container {
  position: relative;
  width: 100%;
  height: 50%; /* Takes up half of the card */
  overflow: hidden;
  border-radius: 15px 15px 0 0;
  flex-shrink: 0;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 15px 10px;
  text-align: left;
}

.profile-name-overlay h2 {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  margin: 0;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
}

.profile-status-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  display: flex;
  gap: 5px;
}

.status-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.favorite-icon {
  color: #FFD700;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
}

.user-tag {
  background-color: #f0f0f0;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 0.8rem;
  color: #555;
}

.profile-card {
  background-color: white;
  border-radius: 15px;
  width: 60%;
  max-width: 500px;
  height: calc(100vw * 1.5);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  max-height: 90%;
  display: flex;
  flex-direction: column;
}

.profile-main {
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.profile-picture {
  flex-shrink: 0;
  margin-bottom: 1rem;
}

.profile-picture img {
  width: clamp(100px, 50%, 200px);
  height: auto;
  aspect-ratio: 1/1;
  border-radius: 15px;
  object-fit: cover;
}

.profile-details {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.75rem;
  text-align: left;
}
.profile-details h2 {
  margin-bottom: 0.75rem;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
}

.profile-details p {
  margin: 0.5rem 0;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
}

.message-btn {
  background-color: #ffd400;
  border: 1px solid black;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  margin-top: 1rem;
  cursor: pointer;
}

.message-btn:hover {
  background-color: darkorange;
}

.user-progress {
  margin-top: 0.5rem;
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  color: #666;
}

/* Detail Card Styling */
.detail-card {
  text-align: left;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  scroll-behavior: smooth;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  position: sticky;
  top: 0;
  background-color: rgba(255, 240, 195, 0.95);
  backdrop-filter: blur(5px);
  z-index: 5;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  border-bottom: 2px solid #FFD400;
}

.detail-header h2 {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  margin: 0;
  color: #333;
}

.close-btn {
  background: #fff;
  border: 2px solid #FFD400;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #FFD400;
  transform: scale(1.05);
}

.detail-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 2px;
  width: 32px;
  height: 32px;
  background: rgba(255, 240, 195, 0.95);
  border-radius: 50%;
  color: #333;
}

.photos-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.photo-item {
  aspect-ratio: 1/1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.interest-tag {
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #555;
  transition: all 0.2s ease;
}

.interest-tag:hover {
  background-color: #FFD400;
  border-color: #FFD400;
  color: #333;
  transform: translateY(-2px);
}

.description-card {
  background-color: #f9f9f9;
  border-radius: 15px;
  padding: 1.5rem;
  border-left: 4px solid #FFD400;
  position: relative;
  margin-top: 0.5rem;
}

.description-card::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 15px;
  font-size: 3rem;
  color: #FFD400;
  font-family: serif;
  opacity: 0.5;
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.about-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.about-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.about-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  margin-bottom: 0.5rem;
}

.about-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(255, 240, 195, 0.6);
  border-radius: 15px;
  justify-content: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  border: none;
}

.message-action {
  background-color: #FFD400;
  color: #333;
}

.message-action:hover {
  background-color: #e6bf00;
  transform: translateY(-2px);
}

.like-action {
  background-color: #ff6b6b;
  color: white;
}

.like-action:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .detail-header {
    padding: 1rem;
  }
  
  .detail-content {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .photos-gallery {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
  
  .about-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

/* Pass and Like Buttons */
.pass-btn, .like-btn {
  padding: clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 2rem);
  border-radius: 50px;
  border: 1px solid black;
  font-size: clamp(1rem, 3vw, 1.25rem);
  cursor: pointer;
  transition: transform 0.2s;
  white-space: nowrap;
}

.pass-btn {
  background: #f0f0f0;
}

.pass-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.like-btn {
  background: lightyellow;
}

.like-btn:hover {
  background: #FFD400;
  transform: scale(1.05);
}

/* Filter Popup Styling */
.filter-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90%, 400px);
  max-height: 80vh;
  padding: 1.25rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 100;
  overflow-y: auto;
}

.filter-content {
  position: relative;
}

.filter-content h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
}

.filter-content li {
  list-style: none;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.filter-content li strong {
  font-size: clamp(0.9rem, 2.5vw, 1rem);
}

.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 100px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.interest-option {
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
}

.age-slider, .height-slider {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

input[type="range"] {
  width: 45%;
}

select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-top: 0.5rem;
  font-size: clamp(0.85rem, 2.5vw, 0.9rem);
}

.filter-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
}

.apply-btn, .reset-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid black;
  cursor: pointer;
  font-size: clamp(0.85rem, 2.5vw, 0.9rem);
}

.apply-btn {
  background: #ffd400;
}

.reset-btn {
  background: #f0f0f0;
}

/* Message Popup */
.message-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.message-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.message-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.receiver-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.receiver-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eaeaea;
}

.receiver-name {
  margin-left: 12px;
  font-weight: 600;
  color: #333;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.message-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn, .send-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #666;
  border: none;
}

.cancel-btn:hover {
  background-color: #e5e5e5;
}

.send-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

.send-btn:hover {
  background-color: #3a80d2;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.1rem;
}

.textarea-container {
  position: relative;
  width: 80%;
  margin-bottom: 20px;
  margin-right: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  background-color: #fff;
  overflow: hidden;
}

.textarea-container:focus-within {
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
  border-color: #4a90e2;
}

.custom-textarea {
  max-width: 80%;
  padding: 16px;
  margin-right: 10px;
  border: none;
  border-radius: 12px 12px 0 0;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background-color: transparent;
  transition: background-color 0.2s;
}

.custom-textarea:focus {
  outline: none;
  background-color: #f9fbff;
  max-width: 80%;
}

.custom-textarea::placeholder {
  color: #aab7c4;
  font-weight: 400;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f9f9f9;
  border-top: 1px solid #eaeaea;
}

.character-count {
  font-size: 0.8rem;
  color: #aab7c4;
}

.emoji-picker {
  display: flex;
  align-items: center;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.emoji-btn:hover {
  background-color: #eaeaea;
}

/* Animation Effects */
.overlay-icon {
  position: absolute;
  top: 30%;
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

@keyframes slideRight {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(200%) rotate(15deg);
    opacity: 0;
  }
}

@keyframes slideLeft {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-200%) rotate(-15deg);
    opacity: 0;
  }
}

.slide-right {
  animation: slideRight 1s ease-out forwards;
}

.slide-left {
  animation: slideLeft 1s ease-out forwards;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .columns {
    flex-direction: column;
  }
  
  .left-column, .right-column {
    height: 80px;
  }
  
  .center-column {
    flex: 1;
  }
  
  .profile-picture img {
    width: 40%;
  }
}
</style>
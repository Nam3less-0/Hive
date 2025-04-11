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
        <div class="action-button pass-btn" @click="passUser">
          <div class="button-circle">
            <span>✖️</span>
          </div>
          <span class="button-label">Pass</span>
          <span class="button-hint">Swipe left to skip</span>
        </div>
      </div>

      <!-- Center Column -->
      <div class="center-column" :class="{ 'detail-mode': showDetails }">
        <!-- Profile Card -->
        <div v-if="users.length > 0 && currentUserIndex < users.length" 
          class="profile-card" 
          :class="[
          animationDirection, 
          { 'detail-mode': showDetails }
        ]" 
        @animationend="handleAnimationEnd">
        <!-- Heart & Cross Animations -->
          <div class="overlay-icon heart" v-if="showHeart">❤️</div>
          <div class="overlay-icon cross" v-if="showCross">❌</div>
  
          <!-- Main Profile Card -->
          <div v-if="!showDetails" class="profile-main" @click="toggleDetails">
            <div class="profile-picture-container">
              <img class="profile-image" :src="users[currentUserIndex].images && users[currentUserIndex].images.length > 0 
                ? users[currentUserIndex].images[0] 
                : placeholderProfile" 
                alt="User Profile Picture" />

              <!-- Online Status Indicator -->
              <div class="online-icon" v-if="Math.random() > 0.5">Online</div>

              <!-- Status Icons -->
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
              <span class="profession-label" v-if="users[currentUserIndex]?.industry">{{ users[currentUserIndex].industry }}</span>
              <span class="profession-label" v-else>Professional</span>

              <!-- Tags -->
              <div class="user-tags">
                <span class="user-tag" v-if="users[currentUserIndex]?.height">{{ users[currentUserIndex].height }} cm</span>
                <span class="user-tag" v-if="users[currentUserIndex]?.school">{{ users[currentUserIndex].school }}</span>
                <span class="user-tag" v-if="users[currentUserIndex]?.interests && users[currentUserIndex].interests.length > 0">
                  {{ users[currentUserIndex].interests[0] }}
                </span>
             </div>

              <p class="user-bio">{{ users[currentUserIndex]?.bio || 'No bio available' }}</p>

              <!-- Message Button -->
              <button class="message-btn" @click.stop="showMessagePopup = true">
                <span class="message-icon">💬</span> 
                Send a message
              </button>
      
              <!-- Progress Indicator -->
              <div class="user-progress">
                Profile {{ currentUserIndex + 1 }} of {{ users.length }}
                <div class="progress-dots">
                  <span class="progress-dot" 
                        v-for="n in 5" 
                        :key="n" 
                        :class="{ active: (currentUserIndex % 5) + 1 >= n }"></span>
                </div>
              </div>
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

              

              <!-- Personal Info Section - Redesigned -->
              <div>
                <div class="section-header">
                  <div class="section-icon">👤</div>
                  <h3>Personal Details</h3>
                </div>
  
                <!-- New categorized personal info layout -->
                <div class="personal-info-container">
                  <!-- Basics Category -->
                  <div class="info-category">
                    <div class="category-title">
                      <span class="category-icon">📋</span>
                      <h4>Basics</h4>
                    </div>
                    <div class="info-items">
                      <div class="info-item">
                        <div class="info-label">Age</div>
                        <div class="info-value">{{ calculateAge(users[currentUserIndex]?.dateOfBirth) }} years</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Height</div>
                        <div class="info-value">{{ users[currentUserIndex]?.height || 'N/A' }} cm</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Sexual Orientation</div>
                        <div class="info-value">
                          <span class="tag-chip">{{ users[currentUserIndex]?.sexualOrientation || 'Not specified' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <!-- Background Category -->
                  <div class="info-category">
                    <div class="category-title">
                      <span class="category-icon">🌍</span>
                      <h4>Background</h4>
                    </div>
                    <div class="info-items">
                      <div class="info-item">
                        <div class="info-label">Race</div>
                        <div class="info-value">{{ users[currentUserIndex]?.race || 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Religion</div>
                        <div class="info-value">{{ users[currentUserIndex]?.religion || 'Not specified' }}</div>
                      </div>
                    </div>
                  </div>
    
                  <!-- Lifestyle Category -->
                  <div class="info-category">
                    <div class="category-title">
                      <span class="category-icon">🎯</span>
                      <h4>Lifestyle</h4>
                    </div>
                    <div class="info-items">
                      <div class="info-item">
                        <div class="info-label">Drinking</div>
                        <div class="info-value">
                          <span class="lifestyle-indicator" :class="getDrinkingClass(users[currentUserIndex]?.drinking)">
                            <span class="indicator-icon">{{ getDrinkingIcon(users[currentUserIndex]?.alcohol) }}</span>
                            {{ users[currentUserIndex]?.alcohol || 'Not specified' }}
                          </span>
                        </div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Smoking</div>
                        <div class="info-value">
                          <span class="lifestyle-indicator" :class="getSmokingClass(users[currentUserIndex]?.smoking)">
                            <span class="indicator-icon">{{ getSmokingIcon(users[currentUserIndex]?.smoking) }}</span>
                            {{ users[currentUserIndex]?.smoking || 'Not specified' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Professional Category -->
                  <div class="info-category">
                    <div class="category-title">
                      <span class="category-icon">💼</span>
                      <h4>Professional</h4>
                    </div>
                    <div class="info-items">
                      <div class="info-item">
                        <div class="info-label">School</div>
                        <div class="info-value">{{ users[currentUserIndex]?.school || 'Not specified' }}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Industry</div>
                        <div class="info-value">{{ users[currentUserIndex]?.industry || 'Not specified' }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Dating Intentions -->
                  <div class="info-category highlight-category">
                    <div class="category-title">
                      <span class="category-icon">❤️</span>
                      <h4>Dating Intentions</h4>
                    </div>
                    <div class="info-items">
                      <div class="info-item purpose-item">
                        <div class="info-label">Looking for</div>
                        <div class="info-value purpose-value">
                          {{ users[currentUserIndex]?.purpose || 'Not specified' }}
                        </div>
                      </div>
                    </div>
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
        <div class="action-button like-btn" @click="likeUser">
          <div class="button-circle pulse-animation">
            <span>❤️</span>
          </div>
          <span class="button-label">Like</span>
          <span class="button-hint">Swipe right to like</span>
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
          <span class="filter-label">Interests</span>
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
          <span class="filter-label">Age Range</span>
          <div class="slider-container">
            <div class="age-slider">
              <input type="range" v-model="selectedAgeMin" min="18" max="50" @input="adjustAgeRange" />
              <input type="range" v-model="selectedAgeMax" min="18" max="50" @input="adjustAgeRange" />
            </div>
            <span class="range-values">{{ selectedAgeMin }} - {{ selectedAgeMax }} years</span>
          </div>
        </li>

        <!-- Height -->
        <li>
          <span class="filter-label">Height</span>
          <div class="slider-container">
            <div class="height-slider">
              <input type="range" v-model="selectedHeightMin" min="140" max="210" />
              <input type="range" v-model="selectedHeightMax" min="140" max="210" />
            </div>
            <span class="range-values">{{ selectedHeightMin }} - {{ selectedHeightMax }} cm</span>
          </div>
        </li>

        <!-- Race -->
        <li>
          <span class="filter-label">Race</span>
          <div class="select-container">
            <select v-model="selectedRace">
              <option value="">No preference</option>
              <option value="Chinese">Chinese</option>
              <option value="Malay">Malay</option>
              <option value="Indian">Indian</option>
              <option value="Eurasian">Eurasian</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </li>

        <!-- Religion -->
        <li>
          <span class="filter-label">Religion</span>
         <div class="select-container">
            <select v-model="selectedReligion">
              <option value="">No preference</option>
              <option value="Christian">Christian</option>
              <option value="Muslim">Muslim</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Taoist">Taoist</option>
              <option value="others">Others</option>
            </select>
          </div>
        </li>

        <!-- School -->
        <li>
          <span class="filter-label">School</span>
          <div class="select-container">
            <select v-model="selectedSchool">
              <option value="">No preference</option>
              <option v-for="option in schoolOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </li>

        <!-- Industry -->
        <li>
          <span class="filter-label">Industry</span>
          <div class="select-container">
            <select v-model="selectedIndustry">
              <option value="">No preference</option>
              <option v-for="option in industryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </li>

        <!-- Gender -->
        <li>
          <span class="filter-label">Gender</span>
          <div class="select-container">
            <select v-model="selectedGender">
              <option value="">No preference</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
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
import { ref, onMounted, watch } from 'vue';
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

// Dynamic Icon Designs
const getDrinkingIcon = (drinking) => {
  if (!drinking) return '❓';
  const drinkingLower = drinking.toLowerCase();
  
  if (drinkingLower.includes('never') || drinkingLower.includes('non-drinker')) return '🚫';
  if (drinkingLower.includes('rarely') || drinkingLower.includes('occasionally')) return '🥤';
  if (drinkingLower.includes('socially')) return '🍻';
  if (drinkingLower.includes('regularly') || drinkingLower.includes('frequently')) return '🍷';
  return '🥂';
};

const getDrinkingClass = (drinking) => {
  if (!drinking) return '';
  const drinkingLower = drinking.toLowerCase();
  
  if (drinkingLower.includes('never') || drinkingLower.includes('non-drinker')) return 'non-user';
  if (drinkingLower.includes('rarely') || drinkingLower.includes('occasionally')) return 'light-user';
  if (drinkingLower.includes('socially')) return 'social-user';
  if (drinkingLower.includes('regularly') || drinkingLower.includes('frequently')) return 'regular-user';
  return '';
};

const getSmokingIcon = (smoking) => {
  if (!smoking) return '❓';
  const smokingLower = smoking.toLowerCase();
  
  if (smokingLower.includes('never') || smokingLower.includes('non-smoker')) return '🚫';
  if (smokingLower.includes('rarely') || smokingLower.includes('occasionally')) return '💨';
  if (smokingLower.includes('socially')) return '🚬';
  if (smokingLower.includes('regularly') || smokingLower.includes('frequently')) return '🔥';
  return '🚬';
};

const getSmokingClass = (smoking) => {
  if (!smoking) return '';
  const smokingLower = smoking.toLowerCase();
  
  if (smokingLower.includes('never') || smokingLower.includes('non-smoker')) return 'non-user';
  if (smokingLower.includes('rarely') || smokingLower.includes('occasionally')) return 'light-user';
  if (smokingLower.includes('socially')) return 'social-user';
  if (smokingLower.includes('regularly') || smokingLower.includes('frequently')) return 'regular-user';
  return '';
};


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

// Simple image preloading function
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Function to preload the next profile image
const preloadNextProfile = async () => {
  if (users.value.length <= currentUserIndex.value + 1) return; // No more profiles to preload
  
  const nextUser = users.value[currentUserIndex.value + 1];
  if (nextUser && nextUser.images && nextUser.images.length > 0) {
    try {
      await preloadImage(nextUser.images[0]);
      console.log('Next profile image preloaded');
    } catch (error) {
      console.error('Failed to preload next profile image', error);
    }
  }
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
    if (users.value.length > currentUserIndex.value + 1) {
      preloadNextProfile();
    }
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
  // Check if there are users to display
  if (users.value.length === 0) {
    noMoreUsers.value = true;
    return;
  }

  // Remove the current user from the list
  users.value.splice(currentUserIndex.value, 1);

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

  try {
    await updateSeenArray(myUserId, passedUserId);
    animationDirection.value = 'slide-left';
    showCross.value = true;
    
    // Start preloading while animation is happening
    preloadNextProfile();
  } catch (error) {
    console.error("Error passing user:", error);
  }
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
    
    // Start preloading while animation is happening
    preloadNextProfile();
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
  const previousIndex = currentUserIndex.value;
  nextUser();

  if (previousIndex !== currentUserIndex.value) {
    preloadNextProfile();
  }
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
  padding: 0 1.5rem;
  position: relative;
}

.center-column {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1rem;
}
.center-column.detail-mode {
  flex: 4;  /* Give more space to center column when showing details */
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
.profile-card {
  background-color: white;
  border-radius: 20px;
  width: 60%;
  max-width: 500px;
  height: calc(100vw * 5);
  max-height: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  aspect-ratio: 1 / 2;
}

.profile-card.detail-mode {
  width: 80%;  /* Increased from 60% to 80% */
  max-width: 700px;  /* Increased from 500px to 700px */
  transition: width 0.3s ease, max-width 0.3s ease;
}

.profile-main {
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* Image Container */
.profile-picture-container {
  position: relative;
  width: 100%;
  height: 58%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.profile-main:hover .profile-image {
  transform: scale(1.03);
}

/* Profile Status and Actions */
.profile-status-icons {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 5;
  display: flex;
  gap: 8px;
}

.status-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  font-size: 18px;
  transition: transform 0.2s ease;
}

.status-icon:hover {
  transform: scale(1.1);
}

.favorite-icon {
  color: #FFD400;
}

.online-icon {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #4CAF50;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  z-index: 5;
}

/* Profile Name Overlay */
.profile-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 25px 15px 15px;
  text-align: left;
}

.profile-name-overlay h2 {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  margin: 0;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Profile Details Section */
.profile-details {
  flex: 1;
  padding: 1.25rem;
  text-align: left;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: relative;
}

.profile-details::-webkit-scrollbar {
  width: 5px;
}

.profile-details::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 10px;
}

.profession-label {
  display: inline-block;
  background-color: #f8f2d8;
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 12px;
  border-left: 3px solid #FFD400;
}

/* Tags */
.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.user-tag {
  background-color: #f5f5f5;
  border-radius: 15px;
  padding: 6px 12px;
  font-size: 0.85rem;
  color: #555;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.user-tag:hover {
  background-color: #FFD400;
  color: #333;
  border-color: #FFD400;
  transform: translateY(-2px);
}

/* Bio */
.user-bio {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
  margin-bottom: 15px;
  flex: 1;
  position: relative;
  padding-left: 12px;
  border-left: 2px solid #f0f0f0;
}

/* Message Button */
.message-btn {
  background-color: #FFD400;
  border: none;
  padding: 12px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: auto;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(255, 212, 0, 0.3);
  transition: all 0.2s ease;
}

.message-btn:hover {
  background-color: #f5cb00;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 212, 0, 0.4);
}

.message-icon {
  font-size: 1.2rem;
}

/* Progress Indicator */
.user-progress {
  text-align: center;
  margin-top: 12px;
  font-size: 0.85rem;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.progress-dots {
  display: flex;
  gap: 4px;
  margin-left: 5px;
}

.progress-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ddd;
}

.progress-dot.active {
  background-color: #FFD400;
  transform: scale(1.2);
}

/* Heart & Cross Animations */
.overlay-icon {
  position: absolute;
  top: 40%;
  left: 50%;
  font-size: 6rem;
  transform: translateX(-50%);
  z-index: 10;
  opacity: 0;
  animation: fadePop 0.6s ease-in-out forwards;
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.3));
}

@keyframes fadePop {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
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
  color: #ff4757;
}

.cross {
  color: #747d8c;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .profile-card.detail-mode {
    width: 85%;
    max-width: 650px;
  }
}

@media (max-width: 768px) {
  .profile-card {
    width: 85%;
  }
  
  .profile-card.detail-mode {
    width: 90%;
    max-width: none;
  }

  .status-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .profile-name-overlay h2 {
    font-size: 1.2rem;
  }
  
  .profile-details {
    padding: 1rem;
  }
}

/* Card Animations */
@keyframes slideRight {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(200%) rotate(20deg);
    opacity: 0;
  }
}

@keyframes slideLeft {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-200%) rotate(-20deg);
    opacity: 0;
  }
}

.slide-right {
  animation: slideRight 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.slide-left {
  animation: slideLeft 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
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

/* Button Base Styles */
.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 160px;
  max-width: 90%;
}

.button-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.button-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.button-label {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.button-hint {
  font-size: 0.85rem;
  color: #888;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  position: absolute;
  bottom: -25px;
  text-align: center;
  width: 100%;
}

/* Pass Button Specific */
.pass-btn .button-circle {
  background-color: white;
  border: 2px solid #f0f0f0;
  color: #777;
}

.pass-btn:hover .button-circle {
  transform: scale(1.05) rotate(-5deg);
  background-color: #f5f5f5;
  color: #555;
  border-color: #e0e0e0;
}

.pass-btn:active .button-circle {
  transform: scale(0.95);
}

.pass-btn .button-label {
  color: #777;
}

.pass-btn:hover .button-label {
  color: #555;
  transform: scale(1.05);
}

.pass-btn:hover .button-hint {
  opacity: 1;
  transform: translateY(0);
}

.pass-btn:hover .button-circle::before {
  opacity: 0.6;
}

/* Like Button Specific */
.like-btn .button-circle {
  background-color: #FFD400;
  border: 2px solid #FFD400;
  color: #333;
}

.like-btn:hover .button-circle {
  transform: scale(1.1) rotate(5deg);
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.like-btn:active .button-circle {
  transform: scale(0.95);
}

.like-btn .button-label {
  color: #333;
}

.like-btn:hover .button-label {
  color: #ff6b6b;
  transform: scale(1.05);
}

.like-btn:hover .button-hint {
  opacity: 1;
  transform: translateY(0);
}

.like-btn:hover .button-circle::before {
  opacity: 0.6;
}

/* Button Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
}

.pulse-animation {
  animation: pulse 1.5s infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .left-column, .right-column {
    padding: 0 1rem;
  }
  
  .button-circle {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .button-label {
    font-size: 1rem;
  }
  
  .button-hint {
    display: none;
  }
}

@media (max-width: 480px) {
  .action-button {
    width: auto;
  }
  
  .button-circle {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .button-label {
    font-size: 0.9rem;
  }
}

/* Filter Popup Styling */
.filter-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.filter-content {
  position: relative;
  background-color: white;
  border-radius: 20px;
  width: min(90%, 450px);
  max-height: 85vh;
  padding: 1.5rem;
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  overflow-y: auto;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.filter-content::-webkit-scrollbar {
  width: 6px;
}

.filter-content::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 10px;
}

.filter-content h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f5f5f5;
}

.filter-content .close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.filter-content .close-btn:hover {
  color: #333;
}

.filter-content li {
  list-style: none;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.filter-content li:last-child {
  border-bottom: none;
}

.filter-label {
  display: block;
  background-color: #f8f2d8;
  color: #333;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 12px;
  border-left: 3px solid #FFD400;
  width: fit-content;
}

/* Interests Container */
.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 120px;
  overflow-y: auto;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-top: 0.75rem;
  background-color: #f9f9f9;
}

.interests-container::-webkit-scrollbar {
  width: 4px;
}

.interests-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 10px;
}

.interest-option {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.interest-option label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.interest-option label:hover {
  background-color: rgba(255, 212, 0, 0.1);
}

.interest-option input[type="checkbox"] {
  accent-color: #FFD400;
  width: 16px;
  height: 16px;
}

/* Sliders */
.slider-container {
  margin-top: 1rem;
}

.age-slider, .height-slider {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.75rem;
}

input[type="range"] {
  width: 45%;
  accent-color: #FFD400;
  height: 6px;
}

.range-values {
  display: inline-block;
  background-color: #f5f5f5;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Selects */
.select-container {
  margin-top: 0.75rem;
}

select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 0.95rem;
  color: #444;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

select:focus {
  outline: none;
  border-color: #FFD400;
  box-shadow: 0 0 0 2px rgba(255, 212, 0, 0.2);
}

/* Buttons */
.filter-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  gap: 1rem;
}

.apply-btn, .reset-btn {
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
  border: none;
}

.apply-btn {
  background-color: #FFD400;
  color: #333;
  box-shadow: 0 4px 10px rgba(255, 212, 0, 0.3);
}

.apply-btn:hover {
  background-color: #f5cb00;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 212, 0, 0.4);
}

.reset-btn {
  background-color: #f0f0f0;
  color: #555;
}

.reset-btn:hover {
  background-color: #e5e5e5;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .filter-content {
    padding: 1.25rem;
    width: 95%;
  }
  
  .filter-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-content h2 {
    font-size: 1.3rem;
  }
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

/* Main container replacing the about-grid */
.personal-info-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
}

/* Category styling */
.info-category {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.info-category:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Highlight the dating intentions category */
.highlight-category {
  background-color: #fff9e6;
  border-left: 4px solid #FFD400;
}

/* Category title styling */
.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.category-title h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 240, 195, 0.6);
  border-radius: 50%;
  font-size: 0.9rem;
}

/* Items container */
.info-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

/* Individual item styling */
.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

/* Purpose item takes full width */
.purpose-item {
  grid-column: 1 / -1;
}

.purpose-value {
  font-size: 1.2rem;
  color: #222;
  padding: 0.5rem 0;
}

/* Tag chip styling */
.tag-chip {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #555;
  border: 1px solid #e0e0e0;
}

/* Lifestyle indicators */
.lifestyle-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  font-size: 0.9rem;
  background-color: #f8f8f8;
}

.indicator-icon {
  font-size: 1.1rem;
}

/* Different colors for lifestyle status */
.non-user {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.light-user {
  background-color: #e3f2fd;
  color: #1565c0;
}

.social-user {
  background-color: #fff3e0;
  color: #e65100;
}

.regular-user {
  background-color: #fbe9e7;
  color: #c62828;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .info-items {
    grid-template-columns: 1fr;
  }
  
  .info-category {
    padding: 1rem;
  }
}

/* Make the info items one column on very narrow screens */
@media (max-width: 400px) {
  .info-items {
    grid-template-columns: 1fr;
  }
}

/* Tablet optimization */
@media (min-width: 768px) and (max-width: 991px) {
  .info-items {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop optimization */
@media (min-width: 992px) {
  .info-category {
    transition: all 0.3s ease;
  }
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
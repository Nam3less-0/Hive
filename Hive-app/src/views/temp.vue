<template>
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
          <!-- Profile Card (either main or compact) -->
          <div v-if="users.length > 0 && currentUserIndex < users.length">
            <!-- Conditionally Render Main or Detail Card -->
            <div v-if="!showDetails" class="profile-card" @click="toggleDetails">
              <img :src="currentProfile.images?.[0] || placeholderProfile" alt="User Profile Picture" />
              <h2>{{ currentProfile.firstName }} {{ currentProfile.lastName }}</h2>
              <p><strong>Age:</strong> {{ calculateAge(currentProfile.dateOfBirth) }}</p>
              <p><strong>Bio:</strong> {{ currentProfile.bio || 'No bio available' }}</p>
              <button class="message-btn" @click.stop="showMessagePopup = true">Write a message</button>
            </div>
            <div v-else class="detail-card">
              <div class="detail-header">
                <h2>{{ currentProfile.firstName }} {{ currentProfile.lastName }}</h2>
                <button class="close-btn" @click="toggleDetails">❌ Close</button>
              </div>
              <div class="photos">
                <h3>Photos</h3>
                <img v-for="(photo, index) in currentProfile.images || []" :key="index" :src="photo" alt="Photo" />
              </div>
              <div class="interests">
                <h3>Interests</h3>
                <span v-for="(interest, i) in currentProfile.interests || []" :key="i">{{ interest }}</span>
              </div>
              <div class="description-section">
                <h3>Description</h3>
                <p>{{ currentProfile.description || 'No description available' }}</p>
              </div>
              <div class="about-section">
                <h3>About Me</h3>
                <p><strong>Race:</strong> {{ currentProfile.race || 'N/A' }}</p>
                <p><strong>Religion:</strong> {{ currentProfile.religion || 'N/A' }}</p>
                <p><strong>School:</strong> {{ currentProfile.school || 'N/A' }}</p>
                <p><strong>Industry:</strong> {{ currentProfile.industry || 'N/A' }}</p>
              </div>
            </div>
          </div>
  
          <!-- No More Users -->
          <NoMoreUsers v-else class="profile-card" />
        </div>
  
        <!-- Right Column: Like Button -->
        <div class="right-column">
          <button class="like-btn" @click="likeUser">❤️ Like</button>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        users: [],
        currentUserIndex: 0,
        showDetails: false,
        showMessagePopup: false,
        showFilter: false,
        placeholderProfile: 'https://via.placeholder.com/150',
      };
    },
    computed: {
      currentProfile() {
        return this.users[this.currentUserIndex] || {};
      }
    },
    methods: {
      calculateAge(dob) {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        return Math.floor(ageDifMs / (1000 * 60 * 60 * 24 * 365.25));
      },
      passUser() {
        if (this.currentUserIndex < this.users.length - 1) {
          this.currentUserIndex++;
          this.showDetails = false;
        }
      },
      likeUser() {
        if (this.currentUserIndex < this.users.length - 1) {
          this.currentUserIndex++;
          this.showDetails = false;
        }
      },
      toggleDetails() {
        this.showDetails = !this.showDetails;
      },
    },
  };
  </script>
  
  <style scoped>
  .connect-layout {
    position: relative;
  }
  
  .filter-btn-top {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
  }
  
  .columns {
    display: flex;
    width: 100%;
    height: 100vh;
  }
  
  .left-column,
  .center-column,
  .right-column {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .profile-card,
  .detail-card {
    background-color: #fffbee;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    text-align: center;
  }
  
  .detail-card {
    max-width: 800px;
    width: 100%;
    text-align: left;
  }
  
  .photos img {
    width: 80px;
    margin: 5px;
    border-radius: 8px;
  }
  
  .interests span {
    background: #ffd;
    margin: 5px;
    padding: 4px 8px;
    border-radius: 8px;
    display: inline-block;
  }
  
  .pass-btn,
  .like-btn {
    font-size: 1.2rem;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .message-btn {
    margin-top: 10px;
  }
  
  .close-btn {
    float: right;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  </style>
  
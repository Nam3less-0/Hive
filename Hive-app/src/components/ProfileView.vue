<template>
    <div class="profile-view">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchUserProfile" class="retry-button">Retry</button>
      </div>
      
      <div v-else class="profile-container">
        <!-- Enhanced header with background gradient and better spacing -->
        <div class="profile-header">
          <div class="header-decoration"></div>
          <div class="avatar-container">
            <img :src="userData.avatar || profileData.avatar" alt="Profile" class="profile-image" />
          </div>
          <h2 class="profile-name">{{ userData.name || profileData.name }}</h2>
          
          <!-- Quick info badges under the name -->
          <div class="quick-info">
            <span v-if="userData.gender" class="badge">
              <i class="icon gender-icon"></i>{{ userData.gender }}
            </span>
            <span v-if="userData.purpose" class="badge purpose">
              <i class="icon purpose-icon"></i>{{ userData.purpose }}
            </span>
            <span v-if="age" class="badge">
              <i class="icon age-icon"></i>{{ age }} years
            </span>
          </div>
        </div>
        
        <!-- Improved details section with better spacing and visual dividers -->
        <div class="profile-details">
          <!-- Description/About Me shown prominently at the top -->
          <div class="about-section">
            <h3>About Me</h3>
            <p class="profile-description">{{ userData.description || 'No description provided.' }}</p>
          </div>
          
          <div class="details-grid">
            <!-- Left column -->
            <div class="details-column">
              <div class="detail-section">
                <h3>Personal Information</h3>
                <div class="detail-list">
                  <div class="detail-item">
                    <div class="detail-icon personal-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">First Name</span>
                      <span class="detail-value">{{ userData.firstName || 'Not specified' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon personal-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Last Name</span>
                      <span class="detail-value">{{ userData.lastName || 'Not specified' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon gender-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Gender</span>
                      <span class="detail-value">{{ userData.gender || 'Not specified' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon calendar-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Date of Birth</span>
                      <span class="detail-value">{{ formatDate(userData.dateOfBirth) }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon height-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Height</span>
                      <span class="detail-value">{{ userData.height || 'Not specified' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Background</h3>
                <div class="detail-list">
                  <div class="detail-item">
                    <div class="detail-icon race-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Race</span>
                      <span class="detail-value">{{ userData.race || 'Not specified' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon religion-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Religion</span>
                      <span class="detail-value">{{ userData.religion || 'Not specified' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right column -->
            <div class="details-column">
              <div class="detail-section">
                <h3>Lifestyle</h3>
                <div class="detail-list">
                  <div class="detail-item">
                    <div class="detail-icon alcohol-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Alcohol</span>
                      <span class="detail-value">{{ userData.alcohol || 'Not specified' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon smoking-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Smoking</span>
                      <span class="detail-value">{{ userData.smoking || 'Not specified' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Dating Preferences</h3>
                <div class="detail-list">
                  <div class="detail-item">
                    <div class="detail-icon purpose-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Purpose</span>
                      <span class="detail-value">{{ userData.purpose || 'Not specified' }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-icon orientation-icon"></div>
                    <div class="detail-content">
                      <span class="detail-label">Sexual Orientation</span>
                      <span class="detail-value">{{ userData.sexualOrientation || 'Not specified' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
    
  <script>
  import { ref, onMounted, computed, watch } from 'vue';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/firebase';
    
  export default {
    name: "ProfileView",
    props: {
      profileData: {
        type: Object,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      currentUserId: {
        type: String,
        required: true,
      }
    },
    setup(props) {
      const userData = ref({});
      const loading = ref(true);
      const error = ref(null);
    
      const fetchUserProfile = async () => {
        loading.value = true;
        error.value = null;
        
        try {
          if (!props.userId) {
            throw new Error('No user ID provided');
          }
          
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', props.userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (!userDocSnap.exists()) {
            throw new Error('User profile not found');
          }
          
          // Merge the fetched data with any data from props
          userData.value = {
            ...props.profileData,  // Keep original data
            ...userDocSnap.data()  // Override with database values
          };
        } catch (err) {
          console.error('Error fetching user profile:', err);
          error.value = 'Failed to load profile data: ' + err.message;
        } finally {
          loading.value = false;
        }
      };
      
      // Watch for changes to userId and refetch data when it changes
      watch(() => props.userId, (newUserId, oldUserId) => {
        if (newUserId && newUserId !== oldUserId) {
          fetchUserProfile();
        }
      });
      
      onMounted(() => {
        if (props.userId) {
          fetchUserProfile();
        }
      });
      
      const age = computed(() => {
        const dob = userData.value.dateOfBirth;
        if (!dob) return null;
        
        try {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();
          
          if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          return age;
        } catch (error) {
          console.error("Error calculating age:", error);
          return null;
        }
      });
      
      const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (error) {
          console.error("Error formatting date:", error);
          return dateString || 'Not specified';
        }
      };
      
      return {
        userData,
        loading,
        error,
        fetchUserProfile,
        age,
        formatDate
      };
    }
  };
  </script>
    
  <style scoped>
  /* Main container styles - adjusted for full width and scrolling */
  .profile-view {
    height: 100%;
    width: 100%;
    overflow-y: auto; /* Enable vertical scrolling */
    background-color: #f7f7f7;
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    position: relative; /* Ensure position context for children */
    display: flex;
    flex-direction: column;
  }
    
  .profile-container {
    width: 100%; /* Take full width of parent */
    margin: 0;
    background-color: #fff;
    overflow-y: visible; /* Allow content to expand for scrolling */
    flex: 1;
  }
    
  /* Loading and error states */
  .loading-container, .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    text-align: center;
    padding: 2rem;
  }
    
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 204, 0, 0.2);
    border-radius: 50%;
    border-top-color: #ffcc00;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
    
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
    
  .error-container p {
    color: #d32f2f;
    margin-bottom: 1rem;
  }
    
  .retry-button {
    background-color: #ffcc00;
    color: #333;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
    
  .retry-button:hover {
    background-color: #ffb300;
  }
    
  /* Enhanced header styling */
  .profile-header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3.5rem 1.5rem 2rem;
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    border-bottom: 1px solid #f0f0f0;
  }
    
  .header-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(135deg, #ffda6b, #ffb347);
    z-index: 0;
  }
    
  .avatar-container {
    position: relative;
    z-index: 1;
    padding: 4px;
    background-color: #fff;
    border-radius: 50%;
    margin-bottom: 1.25rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
    
  .profile-image {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 0 0 2px #ffcc00;
    transition: transform 0.3s ease;
  }
    
  .profile-image:hover {
    transform: scale(1.03);
  }
    
  .profile-name {
    font-size: 2rem;
    font-weight: 700;
    color: #222;
    margin: 0.75rem 0 0.5rem;
    position: relative;
    z-index: 1;
  }
    
  /* Quick info badges */
  .quick-info {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
    position: relative;
    z-index: 1;
  }
    
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.75rem;
    background-color: #f5f5f5;
    border-radius: 20px;
    font-size: 0.875rem;
    color: #555;
    font-weight: 500;
  }
    
  .badge.purpose {
    background-color: #fffaf0;
    color: #d4a12c;
  }
    
  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 0.4rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.7;
  }
    
  /* Profile details layout */
  .profile-details {
    padding: 0;
    width: 100%;
  }
    
  .about-section {
    padding: 1.75rem 2rem;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
  }
    
  .about-section h3 {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 600;
    position: relative;
    display: inline-block;
  }
    
  .about-section h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background-color: #ffcc00;
    border-radius: 2px;
  }
    
  .profile-description {
    line-height: 1.7;
    color: #444;
    white-space: pre-line;
    font-size: 1rem;
  }
    
  /* Grid layout for details */
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 1.75rem 2rem 2.5rem;
    width: 100%;
    box-sizing: border-box;
  }
    
  .details-column {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
    
  .detail-section {
    background-color: #fff;
  }
    
  .detail-section h3 {
    font-size: 1.15rem;
    color: #333;
    margin-bottom: 1.25rem;
    font-weight: 600;
    position: relative;
    display: inline-block;
  }
    
  .detail-section h3::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background-color: #ffcc00;
    border-radius: 2px;
  }
    
  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
    
  .detail-item {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem 0;
  }
    
  .detail-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #f7f7f7;
    margin-right: 0.875rem;
    position: relative;
    flex-shrink: 0;
  }
    
  .detail-icon::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.5;
  }
    
  .detail-content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
    
  .detail-label {
    font-size: 0.875rem;
    color: #777;
    margin-bottom: 0.25rem;
  }
    
  .detail-value {
    font-size: 1rem;
    color: #333;
    font-weight: 500;
  }
    
  /* Icons styling (using pseudo-elements to simulate icons) */
  .personal-icon::before { content: 'P'; }
  .gender-icon::before { content: 'G'; }
  .calendar-icon::before { content: 'D'; }
  .height-icon::before { content: 'H'; }
  .race-icon::before { content: 'R'; }
  .religion-icon::before { content: 'R'; }
  .alcohol-icon::before { content: 'A'; }
  .smoking-icon::before { content: 'S'; }
  .purpose-icon::before { content: 'P'; }
  .orientation-icon::before { content: 'O'; }
    
  /* Responsive design */
  @media (max-width: 768px) {
    .details-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 1.5rem;
    }
    
    .about-section {
      padding: 1.5rem;
    }
    
    .avatar-container {
      margin-bottom: 1rem;
    }
    
    .profile-image {
      width: 120px;
      height: 120px;
    }
    
    .profile-name {
      font-size: 1.75rem;
    }
  }
    
  @media (max-width: 480px) {
    .profile-header {
      padding: 3rem 1rem 1.5rem;
    }
    
    .avatar-container {
      margin-bottom: 0.75rem;
    }
    
    .profile-image {
      width: 100px;
      height: 100px;
      border-width: 2px;
    }
    
    .profile-name {
      font-size: 1.5rem;
    }
    
    .about-section,
    .details-grid {
      padding: 1.25rem;
    }
    
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
    }
    
    .detail-icon {
      width: 24px;
      height: 24px;
    }
    
    .detail-value {
      font-size: 0.95rem;
    }
  }
  </style>
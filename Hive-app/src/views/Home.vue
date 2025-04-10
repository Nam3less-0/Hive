<template>
  <div class="page-wrapper">
    <div class="background-grid">
      <div v-for="n in 500" :key="n" class="grid-cell" :style="getRandomAnimationStyle()"></div>
    </div>

    <div class="home-container">
      <div class="content-wrapper">
        <!-- Flex container with two sections -->
        <div class="main-content">
          
          <!-- Left Section: Likes and Streaks -->
          <div class="left-section">
            <div class="likes-box">
              <img src="@/assets/info-sign.png" alt="info" class="info" />
              <div class="other-likes">
                <h3>Welcome Back!</h3>
                <p>You have {{ likeCount }} new {{ likeCount === 1 ? 'like' : 'likes' }}!</p>
                <button class="view-likes" @click="goToMyBuzzes">
                  View Likes
                </button>
              </div>
            </div>

            <div class="streak-box">
              <h2>Longest Streak:</h2>
              <div class="streak-details" v-if="longestStreak.matchId">
                <img
                  :src="longestStreak.profilePic || '@/assets/placeholder-profile.jpg'"
                  alt="profile"
                  class="streak-pic"
                />
                <div class="streak-text">
                  <p class="streak-name"><b>{{ longestStreak.name }}</b></p>
                  <p class="streak-days">{{ longestStreak.streakCount }} Days! 🔥</p>
                </div>
              </div>
              <p v-else>No streaks yet.</p>
            </div>
          </div>

          <!-- Right Section: Chart -->
          <div class="right-section">
            <MatchChart />
          </div>

        </div>
      </div>

    
    <footer class="footer">
      <div class="footer-content">
        <a href="#" @click="openContactModal">Contact</a>
        <a href="#" @click="openTermsModal">Terms of Use</a>
        <a href="#" @click="openPrivacyPolicyModal">Privacy Policy</a>
        <a href="#" @click="openFAQModal">FAQ</a>
      </div>
      <div class="social-icons">
        <a href="https://www.facebook.com/santtosh.mohan" target="_blank">
          <img src="@/assets/facebook.png" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/sant.tosh/" target="_blank">
          <img src="@/assets/instagram.png" alt="Instagram" />
        </a>
        <img src="@/assets/X.png" alt="X" />
      </div>
    </footer>

    <!-- Contact Modal -->
    <div v-if="showContactModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeContactModal">✖</button>
        <h3>💻 Tech Support - We're Here to Help! 🛠️</h3>
        <p>Need assistance? Our tech support team is ready to assist you with any technical issues, troubleshooting, or general inquiries.</p>
        <div class="contact-info">
          <p>📞 +65 9781 8604 (Santtosh)</p>
          <p>📧 <a href="mailto:herobrine0239@gmail.com">herobrine0239@gmail.com</a></p>
        </div>
      </div>
    </div>

    <!-- Terms of Use Modal -->
    <div v-if="showTermsModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeTermsModal">✖</button>
        <h3>Terms of Use</h3>
        <p>By using our services, you agree to abide by our terms and conditions.</p>
        <p>Ensure responsible usage and compliance with our policies to maintain a safe and engaging experience.</p>
      </div>
    </div>

    <!-- Terms of Privacy Policy Modal -->
    <div v-if="showPrivacyPolicyModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closePrivacyPolicyModal">✖</button>
        <h3>Privacy Policy</h3>
        <p>Your privacy is important to us. We are committed to protecting your personal information and ensuring a secure experience.</p>
        <p><b>Data Collection</b>: We collect only the necessary information to enhance your experience.</p>
        <p><b>Usage</b>: Your data is used solely for service improvement and will never be shared without consent.</p>
        <p><b>Security</b>: We implement industry-standard measures to keep your data safe.</p>
        <p><b>Your rights</b>: You have control over your personal information and can request modifications or deletions at any time.</p>
      </div>
    </div>

    <!-- FAQ Modal -->
    <div v-if="showFAQModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="closeFAQModal">✖</button>
        <h3>FAQ</h3>
        <p>Question: Why can I not see a user's profile? <br/> Answer: <b>YOU HAVE BEEN BLOCKED.</b></p>
        <p>Question: How to delete my account? <br/> Answer: <b>Go to your profile -> Security -> "Delete Account".</b></p>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from "@/firebase";
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import MatchChart from '@/components/MatchChart.vue';

const router = useRouter();
const likeCount = ref(0);
const longestStreak = ref({});
const userID = auth.currentUser?.uid;
const showContactModal = ref(false);
const showTermsModal = ref(false);
const showPrivacyPolicyModal = ref(false);
const showFAQModal = ref(false);

const gridSize = 500; // Number of squares
const grid = Array(gridSize).fill(null);
const hoveredIndex = ref(null);

const getRandomAnimationStyle = () => {
  const delay = (Math.random() * 5).toFixed(2);      // 0 to 5s
  const duration = (2 + Math.random() * 3).toFixed(2); // 2 to 5s
  return {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

const fetchLikeCount = async () => {
  try {
    const userRef = doc(db, "users", userID);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      likeCount.value = userSnap.data().likeCount || 0;
    }
  } catch (error) {
    console.error("Error fetching like count:", error);
  }
};

const fetchLongestStreak = async () => {
  try {
    const matchesRef = collection(db, "matches");
    const q = query(matchesRef, where("userIds", "array-contains", userID));
    const matchDocs = await getDocs(q);
    
    let maxStreak = 0;
    let bestMatch = null;
    
    for (const docSnap of matchDocs.docs) {
      const data = docSnap.data();
      maxStreak = data.streakCount;
      if (data.streakCount > maxStreak) {
        const otherUserId = data.userIds.find(id => id !== userID);
        if (!otherUserId) continue;

        // Fetch other user's data
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          bestMatch = { 
            matchId: docSnap.id,
            streakCount: data.streakCount,
            name: userData.firstName || "Unknown", 
            profilePic: userData.images?.[0] || "@/assets/placeholder-profile.jpg"
          };
        }
      }
    }
    
    longestStreak.value = bestMatch || {};
  } catch (error) {
    console.error("Error fetching longest streak:", error);
  }
};


onMounted(async () => {
  await fetchLikeCount();
  await fetchLongestStreak();
});

const openContactModal = () => {
  showContactModal.value = true;
};

const closeContactModal = () => {
  showContactModal.value = false;
};

const openTermsModal = () => {
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};

const openPrivacyPolicyModal = () => {
  showPrivacyPolicyModal.value = true;
};

const closePrivacyPolicyModal = () => {
  showPrivacyPolicyModal.value = false;
};

const openFAQModal = () => {
  showFAQModal.value = true;
};

const closeFAQModal = () => {
  showFAQModal.value = false;
};

const goToMyBuzzes = () => {
  router.push({ name: 'MyBuzzes' });
};
</script>

<style scoped>
/* === GENERAL LAYOUT === */
.page-wrapper {
  position: relative;
  z-index: 0;
}

.home-container {
  position: relative;
  z-index: 1;
  background: transparent;
}

.content-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.main-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  align-items: flex-start;
}

.left-section,
.right-section {
  flex: 1;
  min-width: 300px;
}

/* === BACKGROUND GRID === */
.background-grid {
  position: fixed;
  top: 8vh;
  left: 0;
  width: 100vw;
  height: calc(100vh - 8vh);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: 100px;
  z-index: 0;
  pointer-events: none;
}

.grid-cell {
  background-color: #ffd400;
  border: 1px solid #fbc02d;
  animation: sparkle 5s infinite ease-in-out;
}

@keyframes sparkle {
  0%, 100% { background-color: #ffd400; }
  50% { background-color: white; }
}

/* === LIKES + STREAK BOXES === */
.likes-box,
.streak-box {
  background-color: #fff8e1;
  border: 2px solid #fbc02d;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
  font-size: 1.6rem;
  margin-bottom: 20px;
  pointer-events: none;
}

.info {
  width: 50px;
  height: auto;
}

.other-likes h3,
.other-likes p {
  margin: 0 0 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.view-likes {
  font-size: 1.4rem;
  margin-top: 10px;
  background-color: #ffd400;
  border-radius: 10px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: 0.3s;
  pointer-events: auto;
}

.view-likes:hover {
  background-color: #fdd835;
  transform: scale(1.05);
}

/* === STREAK IMAGE BOX === */
.streak-box {
  background-image: url('@/assets/streak-honeycomb.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.streak-details {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.streak-pic {
  max-width: 10vw;
  max-height: 10vw;
  border-radius: 25px;
  margin-right: 10px;
  width: auto;
  height: auto;
}

/* === MATCH CHART === */
.match-chart-container {
  background-color: #fff8e1;
  border: 2px solid #fbc02d;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
  font-size: 1.6rem;
  width: 100%;
  max-width: 600px;
  pointer-events: none;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

/* === FOOTER === */
.footer {
  background-color: #ffd400;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  height: 6vh;
}

.footer-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-content a {
  text-decoration: none;
  color: black;
  font-weight: bold;
}

.social-icons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.social-icons img {
  width: 20px;
  height: auto;
}

/* === MODALS === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
}

.modal-content {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 50%;
  max-width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: black;
}

/* === RESPONSIVENESS === */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .left-section,
  .right-section {
    width: 100%;
  }

  .match-chart-container {
    max-width: 100%;
  }
}
</style>

<template>
  <div class="home-container">
    <div class="content-wrapper">
      <!-- Left Section: Beehive Image -->
      <div class="left-section">
        <img
          src="@/assets/beehive.png"
          alt="Hive Welcome"
          class="welcome-image"
        />
      </div>
      
      <!-- Right Section: Info (Likes and Streak) -->
      <div class="right-section">
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
    </div>
    
    <footer class="footer">
      <div class="footer-content">
        <a href="#" @click="openContactModal">Contact</a>
        <a href="#" @click="openTermsModal">Terms of Use</a>
        <a href="#" @click="openPrivacyPolicyModal">Privacy Policy</a>
        <a href="#" @click="openFAQModal">FAQ</a>
      </div>
      <div class="social-icons">
        <img src="@/assets/facebook.png" alt="Facebook" />
        <img src="@/assets/instagram.png" alt="Instagram" />
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from "@/firebase";
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

const router = useRouter();
const likeCount = ref(0);
const longestStreak = ref({});
const userID = auth.currentUser?.uid;
const showContactModal = ref(false);
const showTermsModal = ref(false);
const showPrivacyPolicyModal = ref(false);
const showFAQModal = ref(false);

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
          maxStreak = data.streakCount;
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
</script>


<style scoped>
/* Container for the overall page */
.home-container {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Wrapper for left and right sections */
.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding: 20px;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Left Section (Beehive Image) */
.left-section {
  flex: 1 1 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-image {
  max-width: 100%;
  height: auto;
}

/* Right Section (Likes and Streak) */
.right-section {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: center;
}

/* Likes Box */
.likes-box {
  border: 2px solid brown;
  border-radius: 20px;
  padding: 20px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 20px;
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
}

/* Streak Box */
.streak-box {
  border: 2px solid brown;
  border-radius: 20px;
  padding: 20px;
  background-image: url('@/assets/streak-honeycomb.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 1.8rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.streak-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.streak-pic {
  max-width: 10vw;
  max-height: 10vw;
  height: auto;
  width: auto;
  border-radius: 25px;
  margin-right: 10px;
}

/* Footer */
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
  margin-top: 10px;
}

.social-icons img {
  width: 20px;
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .left-section,
  .right-section {
    flex: 1 1 100%;
  }
}

/* Modal */
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
}

.modal-content {
  position: relative; /* Ensures close button is positioned inside */
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  width: 50%;
  max-width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Fix: Close button is now properly positioned inside the modal */
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

</style>

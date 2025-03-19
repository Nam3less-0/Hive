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
        <a href="#">Contact</a>
        <a href="#">Terms of Use</a>
        <a href="#">Privacy Policy</a>
        <a href="#">FAQ</a>
      </div>
      <div class="social-icons">
        <img src="@/assets/facebook.png" alt="Facebook" />
        <img src="@/assets/instagram.png" alt="Instagram" />
        <img src="@/assets/X.png" alt="X" />
      </div>
    </footer>
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
</style>

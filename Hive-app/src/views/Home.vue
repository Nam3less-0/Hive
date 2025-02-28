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
            <p>You have 0 new likes!</p>
            <button class="view-likes" @click="goToMyBuzzes">
              View Likes
            </button>
          </div>
        </div>

        <div class="streak-box">
          <h2>Longest Streak:</h2>
          <div class="streak-details">
            <img
              src="@/assets/placeholder-profile.jpg"
              alt="profile"
              class="streak-pic"
            />
            <div class="streak-text">
              <p class="streak-name"><b>Karen Ng</b></p>
              <p class="streak-days">20 Days! 🔥</p>
            </div>
          </div>
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
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMyBuzzes = () => {
  router.push({ name: 'MyBuzzes' });
};
</script>

<style scoped>
/* Container for the overall page */
.home-container {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
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
  font-family: Arial, sans-serif;
}

.view-likes {
  font-size: 1.4rem;
  margin-top: 10px;
  background-color: #ffd400;
  border-radius: 10px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
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
  font-family: Arial, sans-serif;
}

.streak-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.streak-pic {
  width: 70px;
  height: auto;
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

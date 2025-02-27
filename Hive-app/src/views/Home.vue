<template>
    <div class="home-container">
      <div class="welcome-section">
        <img src="@/assets/beehive.png" alt="Hive Welcome" class="welcome-image" />
      </div>
      
      <div class="info-section">
        <div class="likes-box">
            <img src="@/assets/info-sign.png" alt="info" class="info">
            <div class="other-likes">
                <h3>Welcome Back!</h3>
                <p>You have 0 new likes!</p>
                <button class="view-likes" @click="goToMyBuzzes">View Likes</button>
            </div>
        </div><br>
  
        <div class="streak-box">
          <h2>Longest Streak:</h2><br>
          <div class="streak-details">
            <img src="@/assets/placeholder-profile.jpg" alt="profile" class="streak-pic" />
            <div class ="streak-text">
              <p class="streak-name"><b>Karen Ng</b></p>
              <p class="streak-days">20 Days! 🔥</p>
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
        <img src="@/assets/facebook.png" alt="Facebook">
        <img src="@/assets/instagram.png" alt="Instagram">
        <img src="@/assets/X.png" alt="X">
      </div>
    </footer>

    </div>
  </template>

  
  <script setup>

//import { db, getDoc, doc } from '@/firebase'; 
//import { useRoute, onBeforeRouteEnter } from 'vue-router'; 

/*const likesCount = 0;

// Navigation guard to fetch data when entering the Home page
onBeforeRouteEnter(async (to, from, next) => {
  const userDocRef = doc(db, "users", "USER_ID"); // Replace USER_ID with the actual user's ID
  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      likesReceived.value = docSnap.data().likes;
    } else {
      console.log("No such document!");
    }
    next(); // Proceed to the Home page
  } catch (error) {
    console.log("Error getting document:", error);
    next(); // Proceed even if there's an error fetching data
  }
});*/
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const goToMyBuzzes = () => {
    router.push({ name: 'MyBuzzes' });
    };
  </script>
  
  <style scoped>
  .welcome-section, .info-section {
    float: left;
  }

  .welcome-image {
    width: 750px;
    height: auto;
  }
  .welcome-section {
    margin: 100px 150px 100px 100px;
  }

  .likes-box {
    border: 2px solid brown;
    border-radius: 20px;
    align-items: left;
    padding: 10px 200px 20px 30px;
    font-size: 35px;
    margin-top: 120px;
    margin-bottom: 30px;
    overflow: hidden;
  }

  .view-likes {
    font-size: 25px;
    margin-top: 40px;
    background-color: #FFD400;
    border-radius: 10px;
    padding: 10px;
  }

  .info, .other-likes {
    float: left;
  }

  .info {
    margin: 10px 10px 0px 0px;
    width: 50px;
    height: auto;
  }
  .streak-box {
    border: 2px solid brown;
    border-radius: 20px;
    padding: 20px 200px 20px 30px;
    overflow: hidden;
    text-align: left;
    font-size: 35px;
    background-image: url('@/assets/streak-honeycomb.png'); 
    background-size: cover;  
    background-position: center;  
    background-repeat: no-repeat;  
    }


  .streak-pic {
    width: 70px;
    height: auto;
    padding-right: 10px;
    margin-top: 7px;
    border-radius: 25px;
    padding-left: 10px;
  }

  .streak-pic, .streak-text {
    float:left;
  }

  h3, p {
    margin: 10px 5px 5px 0px;
    font-family: Arial;
  }

  h2 {
    font-family: Arial;
    padding-left: 10px;
  }

  .footer {
  background-color: #FFD400;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}

.footer-content {
  display: flex;
  gap: 20px;
}

.footer-content a {
  text-decoration: none;
  color: black;
  font-weight: bold;
}

.social-icons img {
  width: 20px;
  height: auto;
  margin-left: 20px;
}

.social-icons {
    margin-right: 50px;
}

  </style>
  




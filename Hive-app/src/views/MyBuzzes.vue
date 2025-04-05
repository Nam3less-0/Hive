<template>
  <div class="mybuzzes-container">
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

    <h2>WHERE THE BUZZ AT? 🐝</h2>

    <div v-if="buzzes.length > 0" class="buzzes-grid">
      <div v-for="buzz in buzzes" :key="buzz.id" class="buzz-card">
        <div class="profile-header">
          <span class="match-badge">{{ buzz.matchPercentage }}% Match</span>
          <span v-if="buzz.online" class="online-dot"></span>
          
          <!-- Message Button in the Top Right Corner -->
          <button v-if="buzz.message && buzz.message !== 'None'" class="viewmessage-btn" @click="openMessagePopup(buzz.message)">💬</button>
        </div>

        <img 
          :src="buzz.profilePic || defaultProfilePic" 
          :alt="buzz.name" 
          class="profile-pic"
          @error="handleImageError($event)"
        />

        <h3 class="user-name">{{ buzz.name }}, {{ calculateAge(buzz.dateOfBirth) }}</h3>
        
        <div class="actions">
          <button class="pass-btn" @click="passUser(buzz.element)">✖️ Pass</button>
          <button class="like-btn" @click="likeBack(buzz.element)">💛 Like</button>
        </div>
      </div>
    </div>
    
    <p v-else>No new likes yet.</p>

    <!-- Message Popup -->
    <div v-if="showMessagePopup" class="message-popup">
      <div class="message-content">
        <h2>Message</h2>
        <p>{{ messageContent }}</p>
        <button class="close-btn" @click="closeMessagePopup">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc, updateDoc, arrayRemove , setDoc} from "firebase/firestore";
import { auth, db } from "@/firebase";

export default {
  setup() {
    const buzzes = ref([]);
    const userID = auth.currentUser?.uid || "RKoJcfE5m9fqL9FZa8OXbtv9p7Y2";
    const defaultProfilePic = "https://placehold.co/150x150/png";
    const showMessagePopup = ref(false);
    const messageContent = ref("");

    const getRandomAnimationStyle = () => {
    const delay = (Math.random() * 5).toFixed(2);      // 0 to 5s
    const duration = (2 + Math.random() * 3).toFixed(2); // 2 to 5s
    return {
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    };
  };

    const handleImageError = (event) => {
      event.target.src = defaultProfilePic;
      event.target.onerror = null;
    };

    const openMessagePopup = (message) => {
      messageContent.value = message;
      showMessagePopup.value = true;
    };

    const closeMessagePopup = () => {
      showMessagePopup.value = false;
      messageContent.value = "";
    };

    async function fetchBuzzes() {
      try {
        const userRef = doc(db, "users", userID);
        await updateDoc(userRef, { likeCount: 0 });
        console.log("likeCount reset to 0.");
      } catch (error) {
        console.error("Error resetting likeCount:", error);
      }
      try {
        const userDocRef = doc(db, `users/${userID}`);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error("User document not found");
          return;
        }
        const userData = userDocSnap.data();
        if (!userData.likes || userData.likes.length === 0) {
          console.log("No likes received");
          buzzes.value = [];
          return;
        }
        const likedUserDocs = await Promise.all(userData.likes.map(async (likedEntry) => {
          const likedUserID = likedEntry.userId;
          const likedUserMessage = likedEntry.message;
          const likedUserRef = doc(db, `users/${likedUserID}`);
          const likedUserSnap = await getDoc(likedUserRef);
          
          if (!likedUserSnap.exists()) return null;
          
          const likedUserData = likedUserSnap.data();
          return {
            element: likedEntry,
            id: likedUserID,
            name: likedUserData.firstName || "Unknown",
            dateOfBirth: likedUserData.dateOfBirth || null,
            profilePic: likedUserData.images?.[0] || defaultProfilePic,
            matchPercentage: likedUserData.matchPercentage || "N/A",
            online: likedUserData.online || false,
            message: likedUserMessage || "None"
          };
        }));

        buzzes.value = likedUserDocs.filter(user => user !== null);
      } catch (error) {
        console.error("Error fetching buzzes:", error);
      }
    }
    const likeQueue = ref([]);

async function processLikeQueue() {
  while (likeQueue.value.length > 0) {
    const likedUserID = likeQueue.value.shift();
    await likeBackHandler(likedUserID);
  }
}

async function likeBack(likedUserID) {
  likeQueue.value.push(likedUserID);
  if (likeQueue.value.length === 1) {
    processLikeQueue();
  }
}

async function likeBackHandler(likedUserID) {
  try {
    if (!userID || !likedUserID) {
      console.error("Invalid user ID or liked user ID");
      return;
    }
    const matchID = [userID, likedUserID.userId].sort().join('_');
    const matchRef = doc(db, 'matches', matchID);

    await setDoc(matchRef, {
      userIds: [userID, likedUserID.userId],
      messages: [],
      matchedAt: new Date()
    });

    const userLikesRef = doc(db, 'users', userID);
    await updateDoc(userLikesRef, {
      likes: arrayRemove(likedUserID)
    });

    await fetchBuzzes();
    console.log("Successfully liked back and created a match.");
  } catch (error) {
    console.error("Error liking back:", error);
  }
}
async function passUser(likedUserID) {
  try {
    if (!userID || !likedUserID) {
      console.error("Invalid user ID or liked user ID");
      return;
    }

    const userLikesRef = doc(db, 'users', userID);
    await updateDoc(userLikesRef, {
      likes: arrayRemove(likedUserID)
    });
    await fetchBuzzes();
    console.log("Successfully passed user.");
  } catch (error) {
    console.error("Error passing user:", error);
  }
}  

  function calculateAge(dob) {
      if (!dob) return 'Unknown';
      const birthDate = new Date(dob);
      const diff = Date.now() - birthDate.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    
    
    onMounted(fetchBuzzes);

    return { buzzes, likeBack, getRandomAnimationStyle, passUser, handleImageError, defaultProfilePic, calculateAge,showMessagePopup, messageContent, openMessagePopup, closeMessagePopup };
  }
};




</script>
  
<style scoped>

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

.mybuzzes-container {
  text-align: center;
  padding: 20px;
  background: #ffffff; /* Light yellow background for a softer look */
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.buzzes-grid {
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 20px; /* Uniform spacing */
padding: 20px;
}

.buzz-card {
width: 260px;
padding: 15px;
border: 5px solid #ffcc00; /* Bright yellow border */
border-radius: 20px;
background: white;
text-align: center;
box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
position: relative;
transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.buzz-card:hover {
transform: scale(1.03);
box-shadow: 7px 7px 20px rgba(0, 0, 0, 0.2);
}

.match-badge {
position: absolute;
top: -10px;
left: 50%;
transform: translateX(-50%);
background: #ffcc00;
padding: 6px 12px;
border-radius: 15px;
font-weight: bold;
font-size: 14px;
color: #333;
box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.online-dot {
position: absolute;
top: 10px;
right: 10px;
width: 12px;
height: 12px;
background: green;
border-radius: 50%;
border: 2px solid white;
}

.profile-pic {
width: 100%;
height: 260px;
border-radius: 15px;
object-fit: cover;
}

.user-name {
font-size: 18px;
font-weight: bold;
margin-top: 10px;
color: #333;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.actions {
display: flex;
justify-content: space-between;
margin-top: 10px;
padding: 10px;
}

.pass-btn, .like-btn {
flex: 1;
padding: 12px;
border: none;
border-radius: 10px;
cursor: pointer;
font-weight: bold;
font-size: 16px;
margin: 5px;
transition: background 0.2s ease-in-out, transform 0.2s ease-in-out;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.pass-btn {
background: #ff4d4d;
color: white;
}

.pass-btn:hover {
background: #e60000;
transform: scale(1.05);
}

.like-btn {
background: #ffcc00;
color: black;
}

.like-btn:hover {
background: #e6b800;
transform: scale(1.05);
}

.fake-likes-btn {
background: #ffcc00;
color: black;
font-size: 16px;
padding: 10px 15px;
margin-bottom: 15px;
border: none;
cursor: pointer;
border-radius: 10px;
transition: background 0.2s ease-in-out;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.fake-likes-btn:hover {
background: #e6b800;
}


/* View Message CSS */
.viewmessage-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffd400;
  border: 1px solid black;
  padding: 10px;
  border-radius: 20px;
  font-size: medium;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.viewmessage-btn:hover {
  background: #e6b800;
  transform: scale(1.1);
}

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

.message-popup p {
  padding: 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
  background: #f9f9f9;
}

.close-btn {
  background: lightcoral;
  border: 1px solid black;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.close-btn:hover {
  background: pink;
}
</style>
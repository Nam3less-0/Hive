<template>
  <div class="mybuzzes-container">
    <h2>These People have buzzed you! 🐝</h2>

    <div v-if="buzzes.length > 0" class="buzzes-grid">
      <div v-for="buzz in buzzes" :key="buzz.id" class="buzz-card">
        <div class="profile-header">
          <span class="match-badge">{{ buzz.matchPercentage }}% Match</span>
          <span v-if="buzz.online" class="online-dot"></span>
        </div>

        <img 
          :src="buzz.profilePic || defaultProfilePic" 
          :alt="buzz.name" 
          class="profile-pic"
          @error="handleImageError($event)"
        />

        <h3 class="user-name">{{ buzz.name }}, {{ calculateAge(buzz.dateOfBirth) }}</h3>
        
        <div class="actions">
          <button class="pass-btn" @click="passUser(buzz.id)">✖️ Pass</button>
          <button class="like-btn" @click="likeBack(buzz.id)">💛 Like</button>
        </div>
      </div>
    </div>

    <p v-else>No new likes yet.</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth, db } from "@/firebase"

export default {
  setup() {
    const buzzes = ref([]);
    const userID = auth.currentUser?.uid || "RKoJcfE5m9fqL9FZa8OXbtv9p7Y2";
    const defaultProfilePic = "https://placehold.co/150x150/png";

    const handleImageError = (event) => {
      event.target.src = defaultProfilePic;
      event.target.onerror = null;
    };

    async function fetchBuzzes() {
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

        const likedUserDocs = await Promise.all(userData.likes.map(async (likedUserID) => {
          const likedUserRef = doc(db, `users/${likedUserID}`);
          const likedUserSnap = await getDoc(likedUserRef);
          
          if (!likedUserSnap.exists()) return null;
          
          const likedUserData = likedUserSnap.data();
          return {
            id: likedUserID,
            name: likedUserData.firstName || "Unknown",
            dateOfBirth: likedUserData.dateOfBirth || null,
            profilePic: likedUserData.images?.[0] || defaultProfilePic,
            matchPercentage: likedUserData.matchPercentage || "N/A",
            online: likedUserData.online || false,
          };
        }));

        buzzes.value = likedUserDocs.filter(user => user !== null);
      } catch (error) {
        console.error("Error fetching buzzes:", error);
      }
    }

    async function likeBack(likedUserID) {
  try {
    if (!userID || !likedUserID) {
      console.error("Invalid user ID or liked user ID");
      return;
    }

    const matchID = [userID, likedUserID].sort().join('_'); // Unique match ID
    const matchRef = doc(db, 'matches', matchID);

    // Create match document
    await setDoc(matchRef, {
      userIds: [userID, likedUserID],
      messages: [],
      matchedAt: new Date()
    });

    // Remove each other from 'likes' collections
    const userLikesRef = doc(db, 'users', userID);
    await updateDoc(userLikesRef, {
      likes: arrayRemove(likedUserID)
    });

    await fetchBuzzes(); // Refresh UI

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

    return { buzzes, likeBack, passUser, handleImageError, defaultProfilePic, calculateAge };
  }
};
</script>
  
  <style>
  .mybuzzes-container {
  text-align: center;
  padding: 20px;
  background: #ffffff; /* Light yellow background for a softer look */
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
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
}

.fake-likes-btn:hover {
  background: #e6b800;
}
  </style>
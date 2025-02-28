<template>
    <div class="mybuzzes-container">
      <h2>These People have buzzed you! 🐝</h2>
  
      <button class="fake-likes-btn" @click="addFakeLikes">➕ Add 5 Fake Likes</button>
  
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
  
          <h3 class="user-name">{{ buzz.name }}, {{ buzz.age }}</h3>
          
          <div class="actions">
            <button class="pass-btn" @click="passUser(buzz.id)">✖ Pass</button>
            <button class="like-btn" @click="likeBack(buzz.id)">💛 Like</button>
          </div>
        </div>
      </div>
  
      <p v-else>No new likes yet.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
  import { auth, db } from "@/firebase"
  
  export default {
    setup() {
      const buzzes = ref([]);
      const userID = auth.currentUser?.uid || "RKoJcfE5m9fqL9FZa8OXbtv9p7Y2"; // Replace dynamically if needed
      const defaultProfilePic = "https://placehold.co/150x150/png"; // ✅ Backup image if missing
  
      const handleImageError = (event) => {
        console.warn("⚠ Broken Image Detected, Using Placeholder");
        event.target.src = "https://placehold.co/150x150/png"; 
        event.target.onerror = null; 
      };
  
      async function fetchBuzzes() {
        const likesRef = collection(db, `users/${userID}/likes_received`);
  
        try {
          console.log("Fetching from Firestore...");
          const snapshot = await getDocs(likesRef);
  
          if (snapshot.empty) {
            console.log("⚠ No likes received! Check Firestore.");
          } else {
            snapshot.forEach(doc => console.log("✅ Fetched:", doc.id, doc.data()));
          }
  
          buzzes.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          console.log("🚀 Buzzes in Vue state:", buzzes.value);
        } catch (error) {
          console.error("🔥 Error fetching likes:", error);
        }
      }
  
      async function likeBack(likedUserID) {
    console.log(`💛 Like clicked for user: ${likedUserID}`);

    try {
        // ✅ Fetch liked user's details
        const likedUserDocRef = doc(db, `users/${likedUserID}`);
        const likedUserDocSnap = await getDoc(likedUserDocRef);

        if (!likedUserDocSnap.exists()) {
            console.error("⚠ Liked user not found!");
            return;
        }

        const likedUserData = likedUserDocSnap.data();
        const likedUserName = likedUserData.firstName || "Unknown";
        const likedUserAge = likedUserData.age || "N/A";
        const likedUserProfilePic = likedUserData.profilePic || "https://placehold.co/150x150/png";
        
        // ✅ Fetch current user's details
        const currentUserDocRef = doc(db, `users/${userID}`);
        const currentUserDocSnap = await getDoc(currentUserDocRef);

        if (!currentUserDocSnap.exists()) {
            console.error("⚠ Current user not found!");
            return;
        }

        const currentUserData = currentUserDocSnap.data();
        const currentUserName = currentUserData.firstName || "Unknown";
        const currentUserAge = currentUserData.age || "N/A";
        const currentUserProfilePic = currentUserData.profilePic || "https://placehold.co/150x150/png";

        const matchTime = new Date();

        // ✅ Add each other to matches collection
        await setDoc(doc(db, `users/${userID}/matches/${likedUserID}`), {
            uid: likedUserID,
            name: likedUserName,
            age: likedUserAge,
            profilePic: likedUserProfilePic,
            matchedAt: matchTime
        });

        await setDoc(doc(db, `users/${likedUserID}/matches/${userID}`), {
            uid: userID,
            name: currentUserName,
            age: currentUserAge,
            profilePic: currentUserProfilePic,
            matchedAt: matchTime
        });

        // ✅ Remove from likes_received
        await deleteDoc(doc(db, `users/${userID}/likes_received/${likedUserID}`));

        // ✅ Create a new chat document if it doesn't already exist
        const chatsRef = collection(db, "chats");
        const chatQuery = query(chatsRef, where("userIds", "array-contains", userID));
        const chatSnapshot = await getDocs(chatQuery);

        let chatExists = false;
        chatSnapshot.forEach((doc) => {
            const chatData = doc.data();
            if (chatData.userIds.includes(likedUserID)) {
                chatExists = true;
            }
        });

        if (!chatExists) {
            const newChatRef = doc(chatsRef); // Auto-generate a unique chat ID
            await setDoc(newChatRef, {
                userIds: [userID, likedUserID], // Store both users in chat
                createdAt: new Date(),
                lastMessage: "", // Empty at first
                profilePic: "https://via.placeholder.com/40", // Default chat icon
            });
            console.log("💬 New chat created between", userID, "and", likedUserID);
        } else {
            console.log("✅ Chat already exists between", userID, "and", likedUserID);
        }

        console.log("🔄 Fetching updated likes...");
        await fetchBuzzes(); // ✅ Refresh UI after action

    } catch (error) {
        console.error("🔥 Error handling like:", error);
    }
}

async function passUser(likedUserID) {
    console.log(`❌ Pass clicked for user: ${likedUserID}`);

    try {
        await deleteDoc(doc(db, `users/${userID}/likes_received/${likedUserID}`));


        console.log("🔄 Fetching updated likes...");
        await fetchBuzzes(); // ✅ Fetch latest data to update UI

    } catch (error) {
        console.error("🔥 Error handling pass:", error);
    }
}
  
      // ✅ Function to add 5 fake likes
      async function addFakeLikes() {
        const fakeProfiles = [
          { id: "4OpelAcMJphFv3ll6sTUFedb8a62", name: "Sophia", age: 21, profilePic: "https://randomuser.me/api/portraits/women/3.jpg", matchPercentage: 97 },
          { id: "8BfCSmUpIwZRkVFTNz1SGYOvSho2", name: "Olivia", age: 22, profilePic: "https://randomuser.me/api/portraits/women/5.jpg", matchPercentage: 95 },
          { id: "8j7tWvxAdrfxfew8ZMDJamKHc4o1", name: "Emma", age: 20, profilePic: "https://randomuser.me/api/portraits/women/8.jpg", matchPercentage: 99 },
          { id: "FiItnI37YoZp96Ih7KMuhOoIAqN2", name: "Isabella", age: 24, profilePic: "https://randomuser.me/api/portraits/women/10.jpg", matchPercentage: 90 },
          { id: "K14kLwOEeMa1lhtyyp9jCpBFPit2", name: "Ava", age: 23, profilePic: "https://randomuser.me/api/portraits/women/15.jpg", matchPercentage: 92 }
        ];
  
        try {
          const likesCollection = collection(db, `users/${userID}/likes_received`);
  
          for (const profile of fakeProfiles) {
            const profileRef = doc(likesCollection, profile.id);
            await setDoc(profileRef, profile);
            console.log(`✅ Added fake like for ${profile.name}`);
          }
  
          console.log("🎉 5 Fake Likes Added Successfully!");
          fetchBuzzes(); // ✅ Refresh UI after adding
        } catch (error) {
          console.error("🔥 Error adding fake likes:", error);
        }
      }
  
      onMounted(() => {
        fetchBuzzes();
      });
  
      return { buzzes, likeBack, passUser, handleImageError, addFakeLikes, defaultProfilePic };
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
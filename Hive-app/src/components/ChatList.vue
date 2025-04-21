<template>
  <div class="chat-list-container" :class="{'compact-mode': isCollapsedView}">
    <h2 class="chat-list-title">
      <span class="bee-icon">🐝</span> Matches <span class="bee-icon">🐝</span>
    </h2>

    <!-- Search Bar -->
    <div class="chat-search-container">
      <input
        type="text"
        class="chat-search-input"
        placeholder="Search for a buzz buddy..."
        v-model="searchTerm"
      />
      <span class="search-icon">🔍</span>
    </div>

    <!-- Chat List: Normal View -->
    <ul v-if="!isCollapsedView" class="chat-list">
      <li
        v-for="chat in filteredChats"
        :key="chat.id"
        class="chat-list-item"
        @click="handleChatSelected(chat)"
      >
        <div class="avatar-container">
          <img
            :src="chat.avatar"
            :alt="`${chat.name}'s avatar`"
            class="chat-avatar"
          />
          <div class="hex-outline"></div>
        </div>
        <div class="chat-details">
          <div class="chat-header">
            <span class="chat-name">
              {{ chat.name }}
              <span v-if="chat.streakCount > 0" class="streak-badge" :class="{'streak-animate': chat.animateStreak}">
                🔥 {{ chat.streakCount }}
              </span>
            </span>
            <span class="chat-handle">{{ chat.handle }}</span>
          </div>
          <div class="chat-last-message">
            {{ getLatestMessage(chat).text }}
          </div>
        </div>
        <div class="chat-date">
          {{ formatTimestamp(getLatestMessage(chat).timestamp) }}
        </div>
      </li>
    </ul>

    <!-- Chat List: Compact View -->
    <div v-else class="compact-chat-grid">
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="compact-chat-item"
        @click="handleChatSelected(chat)"
      >
        <div class="compact-avatar-container">
          <img
            :src="chat.avatar"
            :alt="`${chat.name}'s avatar`"
            class="compact-avatar"
          />
          <div class="compact-hex-outline"></div>
          <span v-if="chat.streakCount > 0" class="compact-streak-badge">
            🔥
          </span>
        </div>
        <div class="compact-name">
          {{ chat.name.split(' ')[0] }}
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { db, auth } from "@/firebase"; // Adjust the import based on your Firebase setup
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  onSnapshot,
  collectionGroup
} from "firebase/firestore";

export default {
  name: "ChatList",
  emits: ["chat-selected"],
  data() {
    return {
      searchTerm: "",
      chats: [],
      unsubscribeMatchesListener: null, // Store listener to cleanup later
      cachedUserData: {}, // Cache user data to avoid redundant fetches
      windowWidth: 0, // Will be set properly in mounted hook
      isMobileLayout: false
    };
  },
  computed: {
    isCollapsedView() {
      return this.windowWidth < 600 || this.isMobileLayout; // Threshold for collapsed view
    },
    filteredChats() {
      // First filter out blocked matches
      const nonBlockedChats = this.chats.filter(chat => !chat.blocked);
      
      // Then apply search filter
      const lowerSearch = this.searchTerm.toLowerCase();
      const filtered = nonBlockedChats.filter((chat) => {
        const latestMessage = this.getLatestMessage(chat);
        return (
          chat.name.toLowerCase().includes(lowerSearch) ||
          chat.handle.toLowerCase().includes(lowerSearch) ||
          latestMessage.text.toLowerCase().includes(lowerSearch)
        );
      });
      return filtered.sort((a, b) => {
        const timeA = new Date(this.getLatestMessage(a).timestamp);
        const timeB = new Date(this.getLatestMessage(b).timestamp);
        return timeB - timeA;
      });
    },
    currentUserId() {
      return auth.currentUser ? auth.currentUser.uid : null;
    }
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
      console.log("Window resized. New width:", this.windowWidth);
    },
    checkMediaQuery() {
      const mediaQuery = window.matchMedia('(max-width: 600px)');
      this.isMobileLayout = mediaQuery.matches;
      console.log("Media query check. Is mobile:", this.isMobileLayout);
    },
    setupRealtimeMatchesListener() {
      if (!this.currentUserId) return;
      
      // Create a query for matches containing the current user
      const matchesQuery = query(
        collection(db, "matches"),
        where("userIds", "array-contains", this.currentUserId)
      );
      
      // Set up real-time listener
      this.unsubscribeMatchesListener = onSnapshot(matchesQuery, async (snapshot) => {
        console.log("Firebase matches update detected!");
        
        // Process added and modified matches
        const updates = [];
        
        for (const change of snapshot.docChanges()) {
          const matchDoc = change.doc;
          const matchData = matchDoc.data();
          
          // Find the other user ID
          const matchedUserId = matchData.userIds.find(id => id !== this.currentUserId);
          if (!matchedUserId) continue;
          
          // Get user data (from cache if available)
          let userData;
          if (this.cachedUserData[matchedUserId]) {
            userData = this.cachedUserData[matchedUserId];
          } else {
            const userDoc = await getDoc(doc(db, "users", matchedUserId));
            if (!userDoc.exists()) continue;
            userData = userDoc.data();
            this.cachedUserData[matchedUserId] = userData; // Cache the user data
          }
          
          // Find existing chat entry
          const existingChatIndex = this.chats.findIndex(chat => chat.id === matchDoc.id);
          const existingChat = existingChatIndex >= 0 ? this.chats[existingChatIndex] : null;
          const previousStreak = existingChat ? existingChat.streakCount : 0;
          const newStreak = matchData.streakCount || 0;
          
          const chatData = {
            id: matchDoc.id,
            name: `${userData.firstName} ${userData.lastName}`,
            handle: `@${userData.firstName.toLowerCase()}`,
            avatar: userData.images?.[0] || "https://via.placeholder.com/150", 
            messages: matchData.messages || [],
            userIds: matchData.userIds || [], // Make sure userIds is included here
            streakCount: newStreak,
            animateStreak: newStreak > previousStreak,
            blocked: matchData.blocked || false,
          };
          
          if (change.type === 'removed') {
            // Remove chat if it exists
            if (existingChatIndex >= 0) {
              this.chats.splice(existingChatIndex, 1);
            }
          } else {
            // Add or update chat
            if (existingChatIndex >= 0) {
              this.chats.splice(existingChatIndex, 1, chatData);
            } else {
              this.chats.push(chatData);
            }
          }
        }
        
        // Reset animations after a delay
        setTimeout(() => {
          this.chats.forEach(chat => {
            if (chat.animateStreak) {
              chat.animateStreak = false;
            }
          });
        }, 1000);
      }, (error) => {
        console.error("Error listening to matches:", error);
      });
    },
    getLatestMessage(chat) {
      if (!chat.messages || chat.messages.length === 0) {
        return { text: "", timestamp: "" };
      }
      return chat.messages.reduce((latest, message) => {
        return new Date(message.timestamp) > new Date(latest.timestamp) ? message : latest;
      });
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      const now = new Date();
      
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      ) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const period = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}.${minutes}${period}`;
      } else if (date.getFullYear() === now.getFullYear()) {
        const day = date.getDate();
        const monthNames = [
          "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
        ];
        const month = monthNames[date.getMonth()];
        return `${day} ${month}`;
      } else {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear() % 100;
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        year = year < 10 ? "0" + year : year;
        return `${day}/${month}/${year}`;
      }
    },
    handleChatSelected(chat) {
      // Include all properties when emitting the selected chat
      this.$emit("chat-selected", {
        id: chat.id,
        name: chat.name,
        handle: chat.handle,
        avatar: chat.avatar,
        messages: chat.messages,
        userIds: chat.userIds, // Make sure to include the userIds array
        streakCount: chat.streakCount,
        blocked: chat.blocked
      });
      
      // Log for debugging
      console.log("DEBUG: Emitting chat with userIds:", chat.userIds);
    }
  },
  created() {
    // Set up the real-time listener when component is created
    this.setupRealtimeMatchesListener();
  },
  mounted() {
    // Initialize window width
    this.windowWidth = window.innerWidth;
    
    // Add window resize event listener
    window.addEventListener('resize', this.updateWindowWidth);
    
    // Initial check for media query match
    this.checkMediaQuery();
    
    // Set up media query listener for better compatibility
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    mediaQuery.addEventListener('change', this.checkMediaQuery);
  },
  unmounted() {
    // Clean up the listener when component is destroyed
    if (this.unsubscribeMatchesListener) {
      this.unsubscribeMatchesListener();
    }
    
    // Remove resize event listener
    window.removeEventListener('resize', this.updateWindowWidth);
    
    // Remove media query listener
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    mediaQuery.removeEventListener('change', this.checkMediaQuery);
  },
  watch: {
    // Re-establish the listener if the current user changes
    currentUserId(newId, oldId) {
      if (newId !== oldId) {
        // Clean up old listener
        if (this.unsubscribeMatchesListener) {
          this.unsubscribeMatchesListener();
        }
        // Set up new listener
        this.setupRealtimeMatchesListener();
      }
    }
  }
};
</script>

<style scoped>
/* Bee Theme Colors */
:root {
  --honeycomb-yellow: #FFC107;
  --honeycomb-dark: #FFB000;
  --honeycomb-light: #FFECB3;
  --bee-black: #212121;
  --bee-white: #FFFFFF;
  --honey-brown: #8D6E63;
}

/* General Styling */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.chat-list-container {
  flex: 1;
  height: 100vh;
  background-color: var(--honeycomb-light);
  background-image: repeating-linear-gradient(
    120deg,
    rgba(255, 193, 7, 0.1),
    rgba(255, 193, 7, 0.1) 20px,
    rgba(255, 236, 179, 0.2) 20px,
    rgba(255, 236, 179, 0.2) 40px
  );
  padding: 1.5rem;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
}

/* Large honeycomb watermark */
.chat-list-container::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath fill='%23FFC107' fill-opacity='0.1' d='M35,20.5L55,5l20,15.5V50.5L55,66L35,50.5V20.5z M85,20.5L105,5l20,15.5V50.5L105,66L85,50.5V20.5z M60,40.5L80,25l20,15.5V70.5L80,86L60,70.5V40.5z M10,40.5L30,25l20,15.5V70.5L30,86L10,70.5V40.5z M35,60.5L55,45l20,15.5V90.5L55,106L35,90.5V60.5z M85,60.5L105,45l20,15.5V90.5L105,106L85,90.5V60.5z'/%3E%3C/svg%3E");
  transform: translate(-50%, -50%) rotate(15deg) scale(3);
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

/* Title */
.chat-list-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
  color: var(--bee-black);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}

.bee-icon {
  font-size: 1.5rem;
  display: inline-block;
  animation: flyBee 2s infinite alternate ease-in-out;
}

@keyframes flyBee {
  0% { transform: translateY(0) rotate(5deg); }
  100% { transform: translateY(-5px) rotate(-5deg); }
}

/* Search Bar */
.chat-search-container {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.chat-search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid var(--honeycomb-dark);
  border-radius: 20px;
  font-size: 1rem;
  background-color: var(--bee-white);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.chat-search-input:focus {
  outline: none;
  border-color: var(--honey-brown);
  box-shadow: 0 2px 8px rgba(141, 110, 99, 0.3);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

/* Chat List */
.chat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chat-list-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.8rem;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-left: 5px solid var(--honeycomb-yellow);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  width: 100%;
}

.chat-list-item:hover {
  background-color: var(--bee-white);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Collapsed view styling */
.chat-list-item.collapsed-view {
  justify-content: center;
  padding: 0.5rem;
  border-left-width: 3px;
  width: auto;
  max-width: 70px;
  margin-left: auto;
  margin-right: auto;
}

/* Hexagon avatar container */
.avatar-container {
  position: relative;
  width: 55px;
  height: 55px;
  margin-right: 1rem;
}

.collapsed-view .avatar-container {
  margin-right: 0;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid var(--honeycomb-yellow);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1;
}

.hex-outline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='none' stroke='%23FFC107' stroke-width='2' d='M30,5 L53.3,20 L53.3,50 L30,65 L6.7,50 L6.7,20 L30,5z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: rotateSlow 20s linear infinite;
}

@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.chat-details {
  flex: 1;
  min-width: 0; /* Allow proper text truncation */
  overflow: hidden; /* Ensure content doesn't push out */
}

.chat-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap; /* Allow wrapping on very small screens */
}

.chat-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--bee-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-handle {
  font-size: 0.875rem;
  color: var(--honey-brown);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-last-message {
  font-size: 0.9rem;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-date {
  font-size: 0.75rem;
  color: var(--honey-brown);
  margin-left: 0.5rem;
  background-color: var(--honeycomb-light);
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0; /* Prevent shrinking */
}

/* Streak styles */
.streak-badge {
  background: linear-gradient(45deg, var(--honeycomb-yellow), var(--honeycomb-dark));
  color: var(--bee-black);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: bold;
  display: inline-block;
  position: relative;
  animation: honeyglow 3s infinite alternate;
}

/* Mini streak badge for collapsed view */
.mini-streak-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: var(--honeycomb-dark);
  color: var(--bee-black);
  font-size: 0.8rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--bee-white);
  z-index: 2;
  animation: honeyglow 3s infinite alternate;
}

@keyframes honeyglow {
  0% { box-shadow: 0 0 5px rgba(255, 193, 7, 0.5); }
  100% { box-shadow: 0 0 15px rgba(255, 193, 7, 0.8); }
}

.streak-animate {
  animation: honeyburst 1s ease-in-out;
}

@keyframes honeyburst {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.3); filter: brightness(1.5); }
  100% { transform: scale(1); filter: brightness(1); }
}

/* Compact view specific styles */
.compact-mode {
  padding: 1rem;
}

.compact-chat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 1rem;
  justify-items: center;
  width: 100%;
}

.compact-chat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 70px;
}

.compact-chat-item:hover {
  transform: translateY(-3px);
}

.compact-avatar-container {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 0.5rem;
}

.compact-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid var(--honeycomb-yellow);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1;
}

.compact-hex-outline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath fill='none' stroke='%23FFC107' stroke-width='2' d='M30,5 L53.3,20 L53.3,50 L30,65 L6.7,50 L6.7,20 L30,5z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: rotateSlow 20s linear infinite;
}

.compact-streak-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: var(--honeycomb-dark);
  color: var(--bee-black);
  font-size: 0.8rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--bee-white);
  z-index: 2;
  animation: honeyglow 3s infinite alternate;
}

.compact-name {
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  color: var(--bee-black);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  .chat-list-container {
    padding: 1rem;
  }

  .chat-list-title {
    font-size: 1.5rem;
  }

  .chat-search-input {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .chat-list-title {
    font-size: 1.3rem;
  }

  .chat-search-container {
    margin-bottom: 1rem;
  }

  .chat-search-input {
    padding: 0.6rem 2.2rem 0.6rem 0.8rem;
  }
}
</style>
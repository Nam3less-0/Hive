<template>
    <div class="chat-list-container">
      <h2 class="chat-list-title">Messages</h2>
  
      <!-- Search Bar -->
      <div class="chat-search-container">
        <input
          type="text"
          class="chat-search-input"
          placeholder="Search people or message"
          v-model="searchTerm"
        />
      </div>
  
      <!-- Chat List -->
      <ul class="chat-list">
        <li
  v-for="chat in filteredChats"
  :key="chat.id"
  class="chat-list-item"
  @click="handleChatSelected(chat)"
>
  <img
    :src="chat.avatar"
    :alt="`${chat.name}'s avatar`"
    class="chat-avatar"
  />
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
    </div>
  </template>
  
<script>
import { db , auth } from "@/firebase"; // Adjust the import based on your Firebase setup
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default {
  name: "ChatList",
  emits: ["chat-selected"],
  data() {
    return {
      searchTerm: "",
      chats: []
    };
  },
  computed: {
    filteredChats() {
      const lowerSearch = this.searchTerm.toLowerCase();
      const filtered = this.chats.filter((chat) => {
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
    }
  },
  methods: {
    async fetchChats() {
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  
  const matchesQuery = query(
    collection(db, "matches"),
    where("userIds", "array-contains", currentUser.uid)
  );
  const matchesSnapshot = await getDocs(matchesQuery);

  const chatPromises = matchesSnapshot.docs.map(async (matchDoc) => {
    const matchData = matchDoc.data();
    const matchedUserId = matchData.userIds.find(id => id !== currentUser.uid);
    
    if (!matchedUserId) return null;
    
    const userDoc = await getDoc(doc(db, "users", matchedUserId));
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data();

    // Find existing chat entry
    const existingChat = this.chats.find(chat => chat.id === matchDoc.id);
    const previousStreak = existingChat ? existingChat.streakCount : 0;
    const newStreak = matchData.streakCount || 0;

    return {
      id: matchDoc.id,
      name: `${userData.firstName} ${userData.lastName}`,
      handle: `@${userData.firstName.toLowerCase()}`,
      avatar: userData.images?.[0] || "https://via.placeholder.com/150", 
      messages: matchData.messages || [],
      streakCount: newStreak,
      animateStreak: newStreak > previousStreak, // Animate only if streak increases
    };
  });

  this.chats = (await Promise.all(chatPromises)).filter(chat => chat !== null);
  console.log("Matches retrieved from Firebase:", matchesSnapshot.docs.map(doc => doc.id));

  // Remove animation class after delay to allow re-triggering
  setTimeout(() => {
    this.chats.forEach(chat => chat.animateStreak = false);
  }, 1000);
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
      this.$emit("chat-selected", chat);
    }
  },
  async mounted() {
    await this.fetchChats();
  }
};
</script>


<style scoped>
/* Ensure box-sizing is set to border-box for more predictable layouts */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.streak-badge {
  background: linear-gradient(45deg, rgba(255, 67, 217, 0.8), rgba(168, 67, 255, 0.8));
  background-size: 200% 200%;
  color: white;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: bold;
  display: inline-block;
  animation: fireMove 2s infinite ease-in-out;
}

/* Keyframes to animate the background gradient like fire */
@keyframes fireMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes firePulse {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.3); filter: brightness(1.5); }
  100% { transform: scale(1); filter: brightness(1); }
}

.streak-animate {
  animation: firePulse 1s ease-in-out;
}

/* Responsive container: full width with a max-width on larger screens */
.chat-list-container {
  flex: 1;
  height: 100vh; /* Ensure it extends fully */
  background-color: rgb(239, 228, 193);
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
}


.chat-list-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-search-container {
  margin-bottom: 1rem;
}

.chat-search-input {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chat-list-item {
  display: flex;
  align-items: center;
  background-color: transparent;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-list-item:hover {
  background-color: #f2f2f2;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
}

.chat-details {
  flex: 1;
}

.chat-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.chat-name {
  font-weight: bold;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-handle {
  font-size: 0.875rem;
  color: #666;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-last-message {
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-date {
  font-size: 0.75rem;
  color: black;
  margin-left: 0.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Optional media query for smaller screens */
@media (max-width: 400px) {
  .chat-list-container {
    padding: 0.5rem;
  }

  .chat-list-item {
    padding: 0.5rem 0.25rem;
  }

  .chat-avatar {
    width: 40px;
    height: 40px;
    margin-right: 0.5rem;
  }

  .chat-name {
    font-size: 0.95rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .chat-handle {
    font-size: 0.8rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .chat-last-message {
    font-size: 0.8rem;
    max-width: 120px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .chat-date {
    font-size: 0.7rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
}
</style>
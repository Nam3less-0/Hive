<template>
    <div class="messages-container">
      <!-- Block button at the top right -->
      <button class="block-button" @click="openBlockModal" v-if="selectedChat">
        Block
      </button>
      
      <!-- Left column: Chat List -->
      <div class="chatlist-wrapper">
        <ChatList :currentUserId="currentUserId" @chat-selected="handleChatSelection" />
      </div>
  
      <!-- Right column: Chat header + Chat Room -->
      <div class="chat-content-wrapper" v-if="selectedChat">
        <div class="chat-header">
          <img :src="selectedChat.avatar" alt="Profile" class="chat-profile-pic" />
          <span class="chat-name">{{ selectedChat.name }}</span>
        </div>
        <ChatRoom :chat="selectedChat" :currentUserId="currentUserId" />
      </div>
      
      <!-- Placeholder when no chat is selected -->
      <div class="chat-content-placeholder" v-else>
        <p>Please select a chat to view messages</p>
      </div>
  
      <!-- Block Confirmation Modal -->
      <BlockConfirmationModal 
        :visible="isBlockModalVisible" 
        :username="selectedChat ? selectedChat.name : ''"
        @confirm="handleBlockConfirm"
        @cancel="closeBlockModal"
      />
    </div>
    <div v-if="showNotification" class="notification-toast">
      {{ notificationMessage }}
      <div class="progress-bar"></div> 
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import ChatList from "@/components/ChatList.vue";
  import ChatRoom from "@/components/ChatRoom.vue";
  import BlockConfirmationModal from "@/components/BlockConfirmationModal.vue";
  import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
  import { auth, db } from "@/firebase";
  
  export default {
    name: "MessagesPage",
    components: { ChatList, ChatRoom, BlockConfirmationModal },
    setup() {
      const currentUserId = ref(auth.currentUser?.uid); // Replace with actual user ID retrieval
      const selectedChat = ref(null);
      const isBlockModalVisible = ref(false);
      const showNotification = ref(false);
      const notificationMessage = ref("");
  
      const handleChatSelection = (chat) => {
        selectedChat.value = chat;
      };
  
      const openBlockModal = () => {
        if (selectedChat.value) {
          isBlockModalVisible.value = true;
        }
      };
  
      const closeBlockModal = () => {
        isBlockModalVisible.value = false;
      };

      const handleBlockConfirm = async () => {
  if (!selectedChat.value) return;

  const matchRef = doc(db, "matches", selectedChat.value.id);
  const currentUserRef = doc(db, "users", currentUserId.value);

  try {
    // Fetch match document
    const matchSnap = await getDoc(matchRef);
    if (!matchSnap.exists()) {
      alert("Chat match doesn't exist.");
      return;
    }

    const matchData = matchSnap.data();
    const otherUserId = matchData.userIds.find(id => id !== currentUserId.value);

    // Update match document to set 'blocked' to true
    await updateDoc(matchRef, {
      blocked: true
    });

    // Update current user's document to add otherUserId into 'blocked' array
    await updateDoc(currentUserRef, {
      blocked: arrayUnion(otherUserId)
    });

    // ✅ Show notification and log if it's triggered
    notificationMessage.value = `${selectedChat.value.name} has been successfully blocked.`;
    showNotification.value = true;
    console.log("✅ Notification should be visible now!");

    // ✅ Auto-hide the notification after 3 seconds
    setTimeout(() => {
      console.log("⏳ Hiding notification...");
      showNotification.value = false;
    }, 2000);
    
  } catch (error) {
    console.error("Error blocking user:", error);
    alert("Failed to block user. Please try again.");
  } finally {
    closeBlockModal();
  }
};


  
      return { currentUserId, selectedChat, isBlockModalVisible, handleChatSelection, openBlockModal, closeBlockModal, handleBlockConfirm, showNotification, notificationMessage };
    },
  };
  </script>
  
  <style scoped>
  .messages-container {
    display: flex;
    height: 85vh;
    position: relative;
  }
  
  /* Block Button Styling */
  .block-button {
    position: absolute;
    top: 10px;
    right: 20px;
    background-color: red;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .block-button:hover {
    background-color: darkred;
  }
  
  /* Left column (ChatList) */
  .chatlist-wrapper {
    flex: 1;
    max-width: 30vw;
    height: 85vh;
    overflow-y: auto;
    border-right: 1px solid #ccc;
    padding-right: 10px;
  }

/* Right column (Chat header + ChatRoom) */
.chat-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 60vw;
  background-color: #fff4c2; /* Fallback color */
  background-image: url('src/assets/chatbg.webp'); /* Adjust the path as needed */
  background-size: cover; /* or 'contain' if you prefer */
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

/* Chat header */
.chat-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: rgb(239, 228, 193); /* Fallback color */
  border-bottom: 2px solid #ddd;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px); /* Soft blur effect */
  transition: all 0.3s ease-in-out;
}

/* Profile picture */
.chat-profile-pic {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffcc00;
  transition: transform 0.2s ease-in-out, border 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-profile-pic:hover {
  transform: scale(1.1);
  border-color: #ffb300;
}

/* Chat name styling */
.chat-name {
  font-size: 1.4rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: #333;
  margin-left: 1rem;
  display: flex;
  align-items: center;
}
  /* Placeholder */
  .chat-content-placeholder {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: rgb(239, 228, 193)
  }

  
/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  overflow: hidden;
}

/* Orange progress bar */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* Full width initially */
  height: 4px; /* Thin height */
  background-color: rgba(255, 0, 0, 0.696); 
  animation: progressShrink 2s linear forwards;
}

/* Animation: Shrink the progress bar */
@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}


  </style>
  
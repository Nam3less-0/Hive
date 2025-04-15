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

    <!-- Right column: Chat header + Chat Room or Profile View -->
    <div class="chat-content-wrapper" v-if="selectedChat">
      <div class="chat-header">
        <div class="header-left">
          <!-- Back button - only visible in profile view -->
          <button v-if="showProfileView" @click="toggleProfileView" class="back-button">
            <span class="back-icon">←</span> Back to Chat
          </button>
          <!-- Profile image - clickable to show profile -->
          <img 
            :src="selectedChat.avatar" 
            alt="Profile" 
            class="chat-profile-pic" 
            @click="toggleProfileView"
            :class="{ 'clickable': !showProfileView }"
          />
          <span class="chat-name">{{ selectedChat.name }}</span>
        </div>
      </div>
      
      <!-- Conditional rendering based on view state -->
      <ChatRoom v-if="!showProfileView" :chat="selectedChat" :currentUserId="currentUserId" />
      <ProfileView 
        v-else-if="showProfileView && otherUserId" 
        :profileData="{
        name: selectedChat.name,
        avatar: selectedChat.avatar
        }" 
        :userId="otherUserId"
        :currentUserId="currentUserId"
      />
      <div v-else-if="showProfileView && !otherUserId" class="profile-error">
        <p>Cannot display profile: User ID not found</p>
        <button @click="toggleProfileView" class="back-button">Back to Chat</button>
      </div>
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
import { ref, computed, watch, onMounted } from "vue";
import ChatList from "@/components/ChatList.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ProfileView from "@/components/ProfileView.vue";
import BlockConfirmationModal from "@/components/BlockConfirmationModal.vue";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default {
  name: "MessagesPage",
  components: { ChatList, ChatRoom, BlockConfirmationModal, ProfileView },
  setup() {
    const currentUserId = ref(auth.currentUser?.uid);
    const selectedChat = ref(null);
    const isBlockModalVisible = ref(false);
    const showNotification = ref(false);
    const notificationMessage = ref("");
    const showProfileView = ref(false);
    const isDebugMode = ref(false);
    
    // Compute the other user's ID as a derived state
    const otherUserId = computed(() => {
      if (!selectedChat.value || !selectedChat.value.userIds) {
        console.log("DEBUG: Cannot compute otherUserId - selectedChat or userIds is null/undefined");
        console.log("DEBUG: selectedChat =", selectedChat.value);
        console.log("DEBUG: userIds =", selectedChat.value?.userIds);
        return null;
      }
      
      const foundId = selectedChat.value.userIds.find(id => id !== currentUserId.value);
      console.log(`DEBUG: Found otherUserId: ${foundId || 'null'}`);
      return foundId || null;
    });

    const handleChatSelection = (chat) => {
      console.log("DEBUG: Chat selected:", chat);
      console.log("DEBUG: Chat userIds:", chat?.userIds);
      selectedChat.value = chat;
      showProfileView.value = false; // Reset to chat view on new selection
    };

    const toggleProfileView = () => {
      console.log("DEBUG: Toggling profile view. Current value:", showProfileView.value);
      console.log("DEBUG: otherUserId when toggling:", otherUserId.value);
      showProfileView.value = !showProfileView.value;
    };

    const closeBlockModal = () => {
      isBlockModalVisible.value = false;
    };

    const openBlockModal = () => {
      if (selectedChat.value) {
        isBlockModalVisible.value = true;
      }
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
        const otherId = matchData.userIds.find(id => id !== currentUserId.value);
        console.log("DEBUG: Other user ID from match document:", otherId);

        // Block User Profile
        await updateDoc(matchRef, {blocked: true});

        // Add Blocked Profile to current user blocked array
        await updateDoc(currentUserRef, {blocked: arrayUnion(otherId)});

        // Show notification and log if it's triggered
        notificationMessage.value = `${selectedChat.value.name} has been successfully blocked.`;
        showNotification.value = true;
        console.log("✅ Notification should be visible now!");

        // Auto-hide the notification after 3 seconds
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

    // Debug watchers
    watch(() => selectedChat.value, (newChat, oldChat) => {
      console.log("DEBUG: selectedChat changed:", newChat);
      console.log("DEBUG: userIds in new chat:", newChat?.userIds);
    });
    
    watch(() => otherUserId.value, (newId, oldId) => {
      console.log(`DEBUG: otherUserId changed from ${oldId || 'null'} to ${newId || 'null'}`);
    });
    
    watch(() => showProfileView.value, (newVal, oldVal) => {
      console.log(`DEBUG: showProfileView changed from ${oldVal} to ${newVal}`);
      
      if (newVal === true) {
        // When switching to profile view, check if otherUserId exists
        console.log("DEBUG: Profile view activated. otherUserId =", otherUserId.value);
        
        if (!otherUserId.value) {
          console.log("DEBUG: WARNING - Profile view activated but otherUserId is null!");
          console.log("DEBUG: selectedChat =", selectedChat.value);
          console.log("DEBUG: userIds =", selectedChat.value?.userIds);
          console.log("DEBUG: currentUserId =", currentUserId.value);
        }
      }
    });
    
    onMounted(() => {
      console.log("DEBUG: MessagesPage mounted");
      console.log("DEBUG: currentUserId =", currentUserId.value);
    });

    return { 
      currentUserId, 
      selectedChat, 
      isBlockModalVisible, 
      handleChatSelection, 
      openBlockModal, 
      closeBlockModal, 
      handleBlockConfirm, 
      showNotification, 
      notificationMessage,
      showProfileView, 
      toggleProfileView,
      otherUserId,
      isDebugMode
    };
  },
};
</script>

<style scoped>
.messages-container {
  display: flex;
  height: 86vh;
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Block Button Styling */
.block-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 10;
}
.block-button:hover {
  background-color: darkred;
}

/* Left column (ChatList) */
.chatlist-wrapper {
  flex: 0 0 35%;
  height: 88%;
  overflow-y: auto;
  border-right: 1px solid #ccc;
  padding-right: 0.625rem;
  max-width: 25rem;
  min-width: 15rem;
}

/* Right column (Chat header + ChatRoom) */
.chat-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  z-index: 0; /* Ensure content is above the background */
  max-height: 88vh;
}

.chat-content-wrapper::before {
  content: '';
  position: absolute;
  inset: 0; /* shorthand for top, right, bottom, left: 0 */
  background-image: url('src/assets/chatbg.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(5px); /* Adjust blur as needed */
  z-index: -1; /* Keep it behind the content */
  opacity: 0.2;
}

/* Chat header */
.chat-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: rgb(239, 228, 193); /* Fallback color */
  border-bottom: 2px solid #ddd;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px); /* Soft blur effect */
  transition: all 0.3s ease-in-out;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

/* Back button styling */
.back-button {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-weight: 600;
  transition: transform 0.2s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 5px;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(-2px);
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

/* Profile picture */
.chat-profile-pic {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffcc00;
  transition: transform 0.2s ease-in-out, border 0.2s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-profile-pic.clickable {
  cursor: pointer;
}

.chat-profile-pic.clickable:hover {
  transform: scale(1.1);
  border-color: #ffb300;
}

/* Chat name styling */
.chat-name {
  font-size: 1.2rem;
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
  background-color: rgb(232, 224, 199)
}

/* Profile error state */
.profile-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.profile-error p {
  margin-bottom: 1.5rem;
  color: #d32f2f;
  font-size: 1.1rem;
}

.profile-error .back-button {
  background-color: #ffcc00;
  color: #333;
  padding: 0.5rem 1.25rem;
  border-radius: 5px;
  font-weight: 600;
}

.profile-error .back-button:hover {
  background-color: #ffb300;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  overflow: hidden;
  max-width: 90vw;
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

/* Media queries for responsive design */
@media (max-width: 768px) {
  .messages-container {
    flex-direction: column;
  }
  
  .chatlist-wrapper {
    flex: 0 0 auto;
    max-width: 100%;
    height: 30vh;
    min-height: 200px;
    border-right: none;
    border-bottom: 1px solid #ccc;
    padding-right: 0;
  }
  
  .chat-content-wrapper, .chat-content-placeholder {
    max-width: 100%;
    height: 70vh;
  }
  
  .chat-header {
    padding: 0.75rem;
  }
  
  .chat-profile-pic {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .chat-name {
    font-size: 1rem;
  }

  .block-button {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.3rem 0.6rem;
    font-size: 0.875rem;
  }
  
  .back-button {
    font-size: 0.875rem;
    padding: 0.3rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .chat-profile-pic {
    width: 2rem;
    height: 2rem;
    border-width: 2px;
  }
  
  .chat-name {
    font-size: 0.875rem;
    margin-left: 0.5rem;
  }
  
  .notification-toast {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    top: 0.75rem;
    right: 0.75rem;
  }
  
  .back-button {
    margin-right: 0.5rem;
    font-size: 0.75rem;
  }
  
  .back-icon {
    font-size: 1rem;
  }
}
</style>
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
  </template>
  
  <script>
  import { ref } from "vue";
  import ChatList from "@/components/ChatList.vue";
  import ChatRoom from "@/components/ChatRoom.vue";
  import BlockConfirmationModal from "@/components/BlockConfirmationModal.vue";
  
  export default {
    name: "MessagesPage",
    components: { ChatList, ChatRoom, BlockConfirmationModal },
    setup() {
      const currentUserId = ref("user123"); // Replace with actual user ID retrieval
      const selectedChat = ref(null);
      const isBlockModalVisible = ref(false);
  
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
  
      const handleBlockConfirm = () => {
        if (selectedChat.value) {
          // Here you would implement the block logic (e.g., API call)
          alert(`${selectedChat.value.name} has been blocked.`);
        }
        closeBlockModal();
      };
  
      return { currentUserId, selectedChat, isBlockModalVisible, handleChatSelection, openBlockModal, closeBlockModal, handleBlockConfirm };
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
  }
  
  /* Chat header */
  .chat-header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
  }
  .chat-profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
  }
  .chat-name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  /* Placeholder */
  .chat-content-placeholder {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
  }
  </style>
  
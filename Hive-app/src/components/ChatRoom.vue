<template>
  <div class="chat-container">
    <!-- Scrollable messages container with a ref -->
    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="(message, index) in sortedMessages"
        :key="index"
        :class="[
          'message-container',
          message.sender == currentUserId ? 'sent' : 'received'
        ]"
      >
        <!-- Message bubble -->
        <div class="message">
          <p class="message-text">{{ message.text }}</p>
        </div>
        <!-- Timestamp below bubble (shown conditionally) -->
        <div class="message-time" v-if="shouldShowTimestamp(index)">
          {{ formatMessageTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- Input section fixed to bottom -->
    <div class="input-section">
      <div class="chat-prompter">
        <button class="prompter-toggle" @click="togglePrompter">
          Conversation Starters
          <span v-if="showPrompter">▲</span>
          <span v-else>▼</span>
        </button>
        <div class="prompter-suggestions" v-if="showPrompter">
          <div
            class="chat-prompt"
            v-for="(prompt, index) in chatPrompts"
            :key="index"
            @click="selectChatPrompt(prompt)"
          >
            {{ prompt }}
          </div>
        </div>
      </div>

      <div class="input-bar">
        <button @click="showEmojiPicker = !showEmojiPicker">😀</button>
      
        <EmojiPicker v-if="showEmojiPicker" @select="addEmoji" />

        <input v-model="newMessage" @keyup.enter="handleSendMessage" placeholder="Type a message..." />
        <button @click="handleSendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import { nextTick } from "vue";
import { getChatPrompts } from "@/gpt.mjs"; // Adjust path as needed
import { db } from "@/firebase"; // Adjust import path
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot, Timestamp } from "firebase/firestore";

export default {
  components: {
    EmojiPicker, // ✅ Register the component
  },
  name: "ChatRoom",
  props: {
    chat: {
      type: Object,
      required: true,
    },
    currentUserId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newMessage: "",
      localMessages: [],
      chatPrompts: [],
      showPrompter: false,
      unsubscribe: null,
      showEmojiPicker: false,
    };
  },
  computed: {
    sortedMessages() {
      return [...this.localMessages].sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
    },
  },
  methods: {
    addEmoji(emoji) {
      this.newMessage += emoji.i; // Appends the selected emoji
      this.showEmojiPicker = false;
    },
    
    setupRealTimeListener() {
  if (!this.chat.id) return;

  console.log("Setting up real-time listener for chat:", this.chat.id);
  
  const matchRef = doc(db, "matches", this.chat.id);

  this.unsubscribe = onSnapshot(matchRef, (docSnap) => {
    if (docSnap.exists()) {
      const matchData = docSnap.data();
      this.localMessages = matchData.messages ? [...matchData.messages] : [];
      console.log("📢 Real-time messages updated:", this.localMessages);
      this.scrollToBottom();
    } else {
      console.log("❌ No match found in Firestore.");
    }
  }, (error) => {
    console.error("❌ Error setting up real-time listener:", error);
  });
},

async handleSendMessage() {
  if (!this.newMessage.trim()) return;

  const matchRef = doc(db, "matches", this.chat.id);
  const message = {
    text: this.newMessage,
    sender: this.currentUserId,
    timestamp: new Date().toISOString()
  };

  try {
    const matchDoc = await getDoc(matchRef);
    if (!matchDoc.exists()) {
      console.error("Match document doesn't exist.");
      return;
    }

    const matchData = matchDoc.data();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

    let updatedStreakCount = matchData.streakCount || 0;
    let lastStreakDate = matchData.lastStreakDate || "";

    // Check if it's a new day (resets participants list)
    let participantsToday = new Set(matchData.messagesSentToday || []);
    if (lastStreakDate !== today && participantsToday.size == 0) {
      participantsToday = new Set(); // Reset participants on a new day
    }

    // Add current user to today's participants
    participantsToday.add(this.currentUserId);

    // If both users have sent messages today and the streak is not already updated for today
    if (participantsToday.size === 2 && lastStreakDate !== today) {
      updatedStreakCount += 1;
      lastStreakDate = today;
      participantsToday = new Set();
    }

    // Update Firestore
    await updateDoc(matchRef, {
      messages: arrayUnion(message),
      messagesSentToday: Array.from(participantsToday), // Update today's senders
      lastStreakDate, // Update last streak date to prevent duplicate increments
      streakCount: updatedStreakCount, // Update streak count correctly
    });

    console.log(`✅ Message sent and streak updated! Current streak: ${updatedStreakCount}`);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }

  this.newMessage = "";
},
    
    formatMessageTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
    shouldShowTimestamp(index) {
      const messages = this.sortedMessages;
      if (index === messages.length - 1) return true;
      const currentTime = new Date(messages[index].timestamp);
      const nextTime = new Date(messages[index + 1].timestamp);
      return (nextTime - currentTime) / 60000 > 5;
    },
    async fetchChatPrompts() {
  try {
    const prompts = await getChatPrompts(this.chat.id, this.currentUserId);
    this.chatPrompts = prompts;
  } catch (error) {
    console.error("Error fetching chat prompts:", error);
  }
},
    togglePrompter() {
      this.showPrompter = !this.showPrompter;
      if (this.showPrompter) {
        // Always reprompt ChatGPT when the prompter is toggled on
        this.fetchChatPrompts();
      }
    },
    selectChatPrompt(prompt) {
      this.newMessage = prompt;
    },
    scrollToBottom() {
      // Wait until DOM updates, then scroll to bottom
      nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  watch: {
  "chat.id": {
    handler() {
      if (this.unsubscribe) this.unsubscribe();
      this.setupRealTimeListener();
    },
    immediate: true,
  },
},
beforeUnmount() {
  if (this.unsubscribe) {
    this.unsubscribe();
  }
},  
  mounted() {
    this.scrollToBottom();
  },
};
</script>

<style scoped>
.chat-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh; /* or adjust as needed */
  max-width: 60vw;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 10px;
  overflow: hidden; /* prevent outer scrolling */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px; /* Adjust to match input-section height */
}

.message-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.message-container.sent {
  align-items: flex-end;
}

.message-container.received {
  align-items: flex-start;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 12px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.message-container.sent .message {
  background-color: #FEC20C;
  margin-right: 3px;
}

.message-container.received .message {
  background-color: #eee;
  margin-left: 3px;
}

.message-text {
  margin: 0;
}

.message-time {
  font-size: 0.6rem;
  color: #888;
  margin-top: 4px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.input-section {
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 10;
  padding: 4px 10px;
  border-top: 1px solid #ccc;
  flex-shrink: 0;
}

.chat-prompter {
  margin-bottom: 4px;
}

.prompter-toggle {
  background-color: #17a2b8;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prompter-toggle:hover {
  background-color: #138496;
}

.prompter-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.chat-prompt {
  background-color: #e2e6ea;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-prompt:hover {
  background-color: #d6dadf;
}

.input-bar {
  display: flex;
  padding-top: 10px;
  background-color: #fff;
}

.input-bar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-bar button {
  margin-left: 5px;
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.input-bar button:hover {
  background-color: #0056b3;
}
</style>

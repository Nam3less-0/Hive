<template>
  <div class="chat-container">
    <!-- Honeycomb background elements -->
    <div class="honeycomb-bg"></div>
    
    <!-- Scrollable messages container with a ref -->
    <div class="messages-container" ref="messagesContainer">
      <div class="date-divider">Today</div>
      
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
          <span class="hive-icon">🍯</span> Sweet Conversation Starters 
          <span v-if="showPrompter" class="toggle-icon">▲</span>
          <span v-else class="toggle-icon">▼</span>
        </button>
        
        <transition name="slide">
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
        </transition>
      </div>

      <div class="input-bar">
        <button class="emoji-button" @click="showEmojiPicker = !showEmojiPicker">
          <span class="emoji-icon">😀</span>
        </button>
      
        <div class="emoji-picker-container" v-if="showEmojiPicker">
          <EmojiPicker @select="addEmoji" />
        </div>

        <input 
          v-model="newMessage" 
          @keyup.enter="handleSendMessage" 
          placeholder="Buzz something nice..." 
          class="message-input"
        />
        
        <button class="send-button" @click="handleSendMessage">
          <span class="send-icon">🐝</span> Send
        </button>
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
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

export default {
  components: {
    EmojiPicker,
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
      this.showPrompter = false; // Hide prompter after selection
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
/* Bee Theme Colors */
:root {
  --honeycomb-yellow: #FFC107;
  --honeycomb-dark: #FFB000;
  --honeycomb-light: #FFECB3;
  --bee-black: #212121;
  --bee-white: #FFFFFF;
  --honey-brown: #8D6E63;
  --honey-transparent: rgba(255, 193, 7, 0.1);
}

.chat-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 60vw;
  border: none;
  border-radius: 12px;
  margin: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: var(--honeycomb-light);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-bottom: 5vh;
}

/* Honeycomb background pattern */
.honeycomb-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath fill='%23FFC107' fill-opacity='0.1' d='M35,20.5L55,5l20,15.5V50.5L55,66L35,50.5V20.5z M85,20.5L105,5l20,15.5V50.5L105,66L85,50.5V20.5z M60,40.5L80,25l20,15.5V70.5L80,86L60,70.5V40.5z M10,40.5L30,25l20,15.5V70.5L30,86L10,70.5V40.5z M35,60.5L55,45l20,15.5V90.5L55,106L35,90.5V60.5z M85,60.5L105,45l20,15.5V90.5L105,106L85,90.5V60.5z'/%3E%3C/svg%3E");
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 120px; /* Space for input section */
  position: relative;
  z-index: 1;
}

.date-divider {
  text-align: center;
  margin: 15px 0;
  color: var(--honey-brown);
  position: relative;
  font-size: 0.85rem;
}

.date-divider::before,
.date-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: var(--honeycomb-dark);
  opacity: 0.5;
}

.date-divider::before {
  left: 5%;
}

.date-divider::after {
  right: 5%;
}

.message-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  position: relative;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-container.sent {
  align-items: flex-end;
}

.message-container.received {
  align-items: flex-start;
}

.message {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
}

/* Hexagon bubble style for sent messages */
.message-container.sent .message {
  background-color: rgb(248, 211, 66);
  color: var(--bee-black);
  margin-right: 8px;
  border-bottom-right-radius: 4px;
}

.message-container.sent .message::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: -8px;
  width: 16px;
  height: 16px;
  background-color: var(--honeycomb-yellow);
  clip-path: polygon(0 0, 0% 100%, 100% 100%);
}

/* Bubble style for received messages */
.message-container.received .message {
  background-color: rgb(249, 230, 155);
  color: var(--bee-black);
  margin-left: 8px;
  border-bottom-left-radius: 4px;
}

.message-container.received .message::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: -8px;
  width: 16px;
  height: 16px;
  background-color: var(--bee-white);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

.message-text {
  margin: 0;
  line-height: 1.4;
}

.message-time {
  font-size: 0.65rem;
  color: var(--honey-brown);
  margin-top: 4px;
  opacity: 0.8;
  padding: 0 8px;
}

/* Input section styling */
.input-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  z-index: 10;
  padding: 15px;
  border-top: 2px solid var(--honeycomb-dark);
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
}

/* Prompter styling */
.chat-prompter {
  margin-bottom: 12px;
}

.prompter-toggle {
  background: linear-gradient(135deg, var(--honeycomb-yellow), var(--honeycomb-dark));
  color: var(--bee-black);
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.prompter-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.hive-icon {
  margin-right: 8px;
  font-size: 1.2rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.toggle-icon {
  transition: transform 0.3s ease;
}

/* Slide transition for prompter */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.prompter-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.chat-prompt {
  background: linear-gradient(135deg, var(--honeycomb-light), #ffdb84);
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 193, 7, 0.3);
  color: var(--bee-black);
}

.chat-prompt:hover {
  background: var(--honeycomb-yellow);
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* Input bar styling */
.input-bar {
  display: flex;
  align-items: center;
  background-color: var(--bee-white);
  border-radius: 30px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.emoji-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.emoji-button:hover {
  background-color: var(--honeycomb-light);
}

.emoji-picker-container {
  position: absolute;
  bottom: 60px;
  left: 0;
  z-index: 20;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.message-input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background: transparent;
  color: var(--bee-black);
}

.message-input:focus {
  outline: none;
}

.message-input::placeholder {
  color: #999;
}

.send-button {
  margin-left: 5px;
  padding: 10px 20px;
  border: none;
  background: linear-gradient(135deg, var(--honeycomb-yellow), var(--honeycomb-dark));
  color: var(--bee-black);
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, var(--honeycomb-dark), var(--honeycomb-yellow));
}

.send-icon {
  margin-right: 5px;
  font-size: 1.1rem;
  animation: flyBee 1.5s infinite alternate ease-in-out;
}

@keyframes flyBee {
  0% { transform: translateX(0) rotate(5deg); }
  100% { transform: translateX(-3px) rotate(-5deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chat-container {
    max-width: 100vw;
    margin: 0;
    border-radius: 0;
  }
  
  .message {
    max-width: 80%;
  }
  
  .send-button {
    padding: 10px 15px;
  }
  
  .send-button span {
    display: none;
  }
  
  .send-icon {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .prompter-suggestions {
    max-height: 120px;
    overflow-y: auto;
  }
  
  .message {
    max-width: 85%;
    padding: 10px 12px;
  }
  
  .input-section {
    padding: 10px;
  }
}
</style>